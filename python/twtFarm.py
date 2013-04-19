import sys
import codecs
sys.stdout = codecs.getwriter('utf8')(sys.stdout)

import threading
import twitter
from neo4j import GraphDatabase, INCOMING, Evaluation
import json
import urllib2
import time
import natLanProc

tags = ['#ows','#anonymous']
per_page = 1000 

la_ID=None
jsonInfo=None
l_id = None 

#contained within this comment are the functions for neo4j
server_folder = "/var/lib/neo4j/data/graph.db"
test_folder = "/var/www/twitter/DB/anon-ows-clean"
folder_to_put_db_in = test_folder 
# Create a database
db = GraphDatabase(folder_to_put_db_in)

#small class to hold our tags
class tag:

    def __init__(self,tag):
        self.tag=tag
    def setLA(self,la):
        self.la = la

#threaded url-parser using natLanProc class to be able to timeout requests
class threadParser(threading.Thread):
    def setLink(self,link,natLanProc):
        self.link = link
        self.natLanProc = natLanProc
        self.summary = None
        
    def run(self):
        summary = self.natLanProc.nltk_parse(self.link)
        self.summary = summary




#only to be executed on first run on a new given DB folder set
def initilization():
    with db.transaction:
        #tweet indexes node 
        twt_idx = db.node.indexes.create('tweets')

        #tags indexes node 
        tag_idx = db.node.indexes.create('tags')

        #users indexes node 
        user_idx = db.node.indexes.create('users')

        #links indexes node 
        links_idx = db.node.indexes.create('links')

        print 'Initilization successfuly'

#used every run to get the indexes 
def running():
    with db.transaction:
        tag_idx = db.node.indexes.get('tags')
        twt_idx = db.node.indexes.get('tweets')
        user_idx = db.node.indexes.get('users')
        links_idx = db.node.indexes.get('links')

        print 'Running successfully'
        return tag_idx,twt_idx,user_idx,links_idx

#these methods check our index(s) to test whether a particlur record exists
def getTwt(twtID):
    return twt_idx['id'][twtID].single
def getUser(name):
    return user_idx['name'][name].single
def getLink(link):
    return links_idx['link'][link].single
def getTag(tag):
    return tag_idx['tag'][tag].single

#these methods extract our hashtags, user mentions and links from a tweets text
def extract_hash_tags(s):
    return set(part[1:] for part in s.split() if part.startswith('#'))
def extract_user_mentions(s):
    return set(part[1:] for part in s.split() if part.startswith('@'))
def extract_links(s):
    return set(part[0:] for part in s.split() if part.startswith('http'))


#method to trim nasty chars off the end of our tags/usernames
def clean(inc):
    bads = [':',';','.',',','/','\\','"','\'']
    length = len(inc)
    for b in bads:
        if inc[length-1:length]==b:
            inc = inc[:length-1]
    return inc


#method to get our last accessed id's for a given tag
#if the tag doesn't exsist we initiliaze it and set its last access id to 0
def get_last_access_id(t):
    fo = open('/var/www/twitter/data/tags.json','r')
    la_ID = 0
    global jsonInfo 
    jsonInfo = json.load(fo) 

    found =False
    for j in jsonInfo['tags']:
        if j==t.tag:
            found = True
    if not found:
        jsonInfo['tags'][t.tag] = 0

    fo.close()
    return la_ID 

#method to set the last accessed id after a run on a single tag
def set_last_access_id(t):
    global jsonInfo

    if t.la is not None:
        jsonInfo['tags'][t.tag]= t.la 
    else:
        print 'There were no tweets accessed, leaving last accessed ID untouched'

    return True

#method to write out our changes to the hash tags
def write_out():
    global jsonInfo
    jsonFile = open('/var/www/twitter/data/tags.json','w+')
    jsonFile.write(json.dumps(jsonInfo))
    jsonFile.close()
    return True

#main method which encapsulates all functionality 
def create_twt(twt):

    #look up tweet in index by ID
    twtX = getTwt(twt.id)
    if twtX is not None:
        print 'Duplicate tweet! Not Added !'
        return 

    #change twitters date format to unix timestamp
    hourmin = int(time.strftime('%H%M', time.strptime(twt.created_at,'%a, %d  %b %Y %H:%M:%S +0000')))
    nt =  time.strptime(twt.created_at,'%a, %d  %b %Y %H:%M:%S +0000')
    ft = int(time.mktime(nt))

    with db.transaction:
        twtNode = db.node(id=twt.id,text=twt.text,date=ft,time=hourmin)
        twt_idx['id'][twt.id] = twtNode
        print 'Tweet created; Text: ',twt.text,'\nNode ID: ',twtNode.id

    #look up the user of the tweet in the index to see if they exist
    usr = getUser(twt.user.screen_name)
    if usr is not None:
#        print 'user ',usr['name'],' already exists' 
        with db.transaction:
            usr.TWEETED(twtNode)
    else:
        # create a user if they don't exist
        # use twitter to look up user info
#        userInfo = client.GetUser(user=s.user.screen_name)
        with db.transaction:
            usr = db.node(name=twt.user.screen_name,date=int(time.time()),mentions=0)
            usr.TWEETED(twtNode)
            user_idx['name'][twt.user.screen_name] = usr

#        print 'created user:', usr['name']

    # process hashtags
    ht = extract_hash_tags(s.text)
    for h in ht:
        h = clean(h.lower())
        tag = getTag(h)

        if tag is not None:
            c = tag['count']
            c += 1
            with db.transaction:
                tag['count']=c
        else:
            with db.transaction:
                tag = db.node(name=h,count=1)
                tag_idx['tag'][h] = tag

        print '# ', h 

        with db.transaction:
            usr.USED(tag)
            twtNode.TAGGED(tag)

    um = extract_user_mentions(s.text)
    for m in um:
        m = clean(m.lower())
        try :
            mu = getUser(m)
        except ValueError:
            print 'multiple users???',m
            continue
#        print 'Mentioned: ', m

        if mu is not None:
            c = mu['mentions']
            c += 1
            with db.transaction:
                mu['mentions']=c
                twtNode.MENTIONED(mu)
                usr.REFERENCED(mu)
        else:
#            print 'Adding mentioned user: ', m
            with db.transaction:
                user = db.node(name=m,date=int(time.time()),mentions=1)
                user_idx['name'][m] = user
                usr.REFERENCED(user)
                twtNode.MENTIONED(user)


    #process the links
    lnks = extract_links(s.text) 
    trims = ['"','\'']
    for l in lnks:
        #clean the links
        for t in trims: 
            if l.endswith(t): l = l[:-1]
            if l.startswith(t): l = l[1:]

        fullURL = natLanProc.fullURL(l)
        summary = None
        sum_link = None
        if fullURL is not None:
            link = getLink(fullURL)
            sum_link = fullURL
        else:
            link = getLink(l)
            sum_link = l

        if link is not None:
            print 'Link already indexed, not grabbing summary'
            c = link['count'] 
            c += 1
            with db.transaction:
                link['count'] = c
                usr.LINKS(link)
                twtNode.LINKED(link)
            continue
        else:
            t = threadParser()
            t.setLink(sum_link,natLanProc)
            t.start()
            print 'threading'
            t.join(10)
            if t.is_alive():
                print t.getName(),'took longer than 10, terminating'
                t.join()
            else:
                summary = t.summary

        if summary is None:
            summary = ""

        if fullURL is not None :
            print 'full',fullURL
            print 'summary: ', summary
            with db.transaction:
                link = db.node(short=l,link=fullURL,summary=summary,count=1)
                links_idx['link'][fullURL] = link
                usr.LINKS(link)
                twtNode.LINKED(link)
        else :
            print 'short',l
            print 'summary: ', summary
            with db.transaction:
                link = db.node(short=l,link="",summary="",count=1)
                links_idx['link'][l] = link
                usr.LINKS(link)
                twtNode.LINKED(link)


#initilize our db
#Only to be run on very first instance of twtFarm on any given DB set
#initilization()

#typical db run, grab all the indexes
tag_idx,twt_idx,user_idx,links_idx = running()

#instantiate twitter client
client = twitter.Api()

for index,t in enumerate(tags):
    t = tag(t)
    t.setLA(get_last_access_id(t))
    tags[index] = t


for t in tags:
    #get some search results

    try:
        results = client.GetSearch(term=t.tag,since_id=t.la,per_page=per_page)
    except Exception:
        print 'Prob getting search results '
        continue

    i = 0
    for s in results:
        create_twt(s)    
        if i == 0:
            t.setLA(s.id)
            i+=1
    if not set_last_access_id(t):
        print 'WARNING could not set last accessed ID in json file'



write_out()

db.shutdown()
