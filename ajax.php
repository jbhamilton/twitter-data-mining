<?php

function request($incData){
    $data = json_encode($incData);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_URL, 'http://localhost:7474/db/data/cypher');
    curl_setopt($curl, CURLOPT_POSTFIELDS,$data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: '. strlen($data),'dataType: json'));
    
    $resp = curl_exec($curl);
    curl_close($curl);
    return $resp;
}//request

//function to request tweets, broken into a function for RT problem addressed at botton of page
function tweets($removeWhere){
    $q="";
    $needWhere=false;
    if(isset($_GET['All'])){
        $q .= "START ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon ";
        $q = extraMatches($q);
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt ";
        $q = extraMatches($q);
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH anon<-[:TAGGED]-twt ";
        $q = extraMatches($q);
    }//elif

    if($removeWhere==0){
        $q .= "WHERE twt.text =~ '^RT\\\s+.*$' ";
    }//if
    else{
        $needWhere = true;
    }//else

    $q = dateTimeRange($q,$needWhere);

    $q .= "RETURN distinct twt.text LIMIT 50";
    return $q;

}//tweets

//function to add time variance to the query
function dateTimeRange($q,$needWhere){

    if(!( isset($_GET['sd']) || isset($_GET['ed']) || isset($_GET['st']) || isset($_GET['et']) )){
        $needWhere = false;
    }//if
    $flag = false;

    if($needWhere){
        $q.="WHERE ";
    }//if
    else{
        $flag = true;
    }//else

    if(isset($_GET['sd'])){
        $sd = $_GET['sd'];
        $q = needAnd($q,$flag);
        $q .= "twt.date >= ".$sd." ";
        $flag = true;
    }//if
    if(isset($_GET['ed'])){
        $ed = $_GET['ed'];
        $q = needAnd($q,$flag);
        $q .= "twt.date <= ".$ed." ";
        $flag = true;
    }//if
    if(isset($_GET['st'])){
        $st = $_GET['st'];
        $q = needAnd($q,$flag);
        $q .= "twt.time >= ".$st." ";
        $flag = true;
    }//if
    if(isset($_GET['et'])){
        $et = $_GET['et'];
        $q = needAnd($q,$flag);
        $q .= "twt.time <= ".$et." ";
        $flag = true;
    }//if
    return $q;
}//dateTimeRange

//determine if we need an AND due to the fact that 
//start/end date and start/end time and not mutually exlusive
function needAnd($q,$flag){
    if($flag){
        $q .= "AND ";
    }//if
    return $q;
}//needAnd

//determine if we have equality conditions that need to be met
function needWhere($q){
    $q.="WHERE ";
    return $q;
}//needWhere

//add the extra tags that where added to the context to the query 
function extraTags($q){
    $i = 0;
    while(isset($_GET['t'.$i])){
        $tag = urldecode($_GET['t'.$i]);
        $q.=',tag'.$i.'=node:tags(tag="'.$tag.'") ';
        $i++;
    }//while
    return $q;
}//extraTags

//add the extra matches for the graph that associate with added context
function extraMatches($q){
    $i = 0;
    while(isset($_GET['t'.$i])){
        $q.=',twt-[:TAGGED]->tag'.$i.' ';
        $i++;
    }//while
    return $q;
}//extraMatches

if(isset($_GET['tags'])){
//query for our tags
    $q = "";
    $needWhere = false;
    if(isset($_GET['All'])){
        $q .= "START ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        if(isset($_GET['t0'])){
            $q .= "MATCH twt-[t?:TAGGED]->tag ";    
            $q = extraMatches($q);
            $q .= "WHERE twt-[:TAGGED]->ows AND twt-[:TAGGED]->anon ";
            $needWhere = false;
        }//if
        else{
            $q .= "MATCH ows<-[:TAGGED]-twt,twt-[:TAGGED]->anon,twt-[t?:TAGGED]->tag ";
            $q = extraMatches($q);
            $needWhere = true;
        }//else
    }//if
    else if(isset($_GET['ows'])){
        if(isset($_GET['t0'])){
            $q .= "START ows=node:tags(tag='ows') ";
            $q = extraTags($q);
        }//if
        else{
            $q .= "START twt=node(*),ows=node:tags(tag='ows') ";
            $q = extraTags($q);
        }//else

        $q .= "MATCH twt-[t?:TAGGED]->tag ";
        $q = extraMatches($q);

        $q .= "WHERE twt-[:TAGGED]->ows ";
    }//elif
    else if(isset($_GET['anon'])){

        if(isset($_GET['t0'])){
            $q .= "START anon=node:tags(tag='anonymous') ";
            $q = extraTags($q);
        }//if
        else{
            $q .= "START twt=node(*),anon=node:tags(tag='anonymous') ";
        }//else

        $q .= "MATCH twt-[t?:TAGGED]->tag ";
        $q = extraMatches($q);
        $q .= "WHERE twt-[:TAGGED]->anon ";
    }//elif

    $q = dateTimeRange($q,$needWhere);

    $q .= "RETURN distinct tag.name,count(t) AS c,tag.count ORDER BY c DESC LIMIT 50";

    $query = array("query" => $q);
}//if
else if(isset($_GET['links'])){
//query for our links
    $q = "";
    $needWhere=false;
    if(isset($_GET['All'])){
        $q .= "START ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        if(isset($_GET['t0'])){
            $q .= "MATCH twt-[l:LINKED]->lnk ";
            $q = extraMatches($q);
            $q .= "WHERE ows<-[:TAGGED]-twt AND twt-[:TAGGED]->anon ";
        }//if
        else{
            $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,twt-[l:LINKED]->lnk ";
            $needWhere=true;
        }//else
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        if(isset($_GET['t0'])){
            $q .= "MATCH twt-[l:LINKED]->lnk ";
            $q = extraMatches($q);
            $q .= "WHERE ows<-[:TAGGED]-twt ";
        }//if
        else{
            $q .= "MATCH ows<-[:TAGGED]-twt,twt-[l:LINKED]->lnk ";
            $needWhere = true;
        }//else
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        if(isset($_GET['t0'])){
            $q .= "MATCH twt-[l:LINKED]->lnk ";
            $q = extraMatches($q);
            $q .= "WHERE anon<-[:TAGGED]-twt ";
        }//if
        else{
            $q .= "MATCH anon<-[:TAGGED]-twt,twt-[l:LINKED]->lnk ";

            $needWhere = true;
        }//else
    }//elif

    $q = dateTimeRange($q,$needWhere);

    $q .= "RETURN distinct lnk.link?,lnk.short,count(l) AS c,lnk.count ORDER BY c DESC LIMIT 30";

    $query = array("query" => $q);

}//elif
else if(isset($_GET['tweets'])){
//call tweets
    $q = tweets(0);
    $query = array("query" => $q);

}//elif
else if(isset($_GET['users'])){
//get our users
    $q = "";
    if(isset($_GET['All'])){
        $q .= "START ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH anon<-[:TAGGED]-twt,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//elif

    $q = dateTimeRange($q,true);

    $q .= "RETURN distinct user.name,COUNT(*) AS t ORDER BY t DESC LIMIT 30";

    $query = array("query" => $q);

}//elif
else if(isset($_GET['singleUser'])){
//get a single users tweets
    $q = "";
    $user = urldecode($_GET['singleUser']);
    if(isset($_GET['All'])){
        $q .= "START user=node:users(name='".$user."'),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START user=node:users(name='".$user."'),ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START user=node:users(name='".$user."'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH anon<-[:TAGGED]-twt,user-[:TWEETED]->twt ";
        $q = extraMatches($q);
    }//elif

    $q = dateTimeRange($q,true);

    $q .= "RETURN distinct twt.text,twt.date ORDER BY twt.date DESC LIMIT 30";

    $query = array("query" => $q);

}//elif
else if(isset($_GET['singleLink'])){
//get the tweets associated with a single link 
    $q = "";
    $link = urldecode($_GET['singleLink']);
    if(isset($_GET['All'])){
        $q .= "START link=node:links(link='".$link."'),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,link<-[:LINKED]-twt ";
        $q = extraMatches($q);
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START link=node:links(link='".$link."'),ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        $q .= "MATCH ows<-[:TAGGED]-twt,link<-[:LINKED]-twt ";
        $q = extraMatches($q);
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START link=node:links(link='".$link."'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH anon<-[:TAGGED]-twt,link<-[:LINKED]-twt ";
        $q = extraMatches($q);
    }//elif

    $q = dateTimeRange($q,true);

    $q .= "RETURN distinct twt.text LIMIT 15";

    $query = array("query" => $q);
   
}//elif
else if(isset($_GET['singleTag'])){
//get the count for the context of a single tag
    $q = "";
    $tag = urldecode($_GET['singleTag']);

    if(isset($_GET['All'])){
        if($tag=="anonymous"){
            $q .= "START ows=node:tags(tag='ows'),tag=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH ows<-[:TAGGED]-twt-[t:TAGGED]->tag ";
            $q = extraMatches($q);
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH tag<-[t:TAGGED]-twt-[:TAGGED]->anon ";
            $q = extraMatches($q);
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//else
    }//if
    else if(isset($_GET['ows'])){
        if($tag=="anonymous"){
            $q .= "START tag=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows') ";
            $q = extraTags($q);
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),ows=node:tags(tag='ows') ";
            $q = extraTags($q);
            $q .= "MATCH ows<-[:TAGGED]-twt,tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//else
    }//elif
    else if(isset($_GET['anon'])){
        if($tag=="anonymous"){
            $q .= "START tag=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows') ";
            $q = extraTags($q);
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),anon=node:tags(tag='anonymous') ";
            $q = extraTags($q);
            $q .= "MATCH anon<-[:TAGGED]-twt,tag<-[t:TAGGED]-twt ";
            $q = extraMatches($q);
        }//else
    }//elif

    $q = dateTimeRange($q,true);

    $q .= "RETURN COUNT(t) AS count,tag.count";

    $query = array("query" => $q);

}//elif
else if(isset($_GET['singleLinkDate'])){
//get the tweet times for a single link
    $q = "";
    $link = urldecode($_GET['singleLinkDate']);
    if(isset($_GET['short'])){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$link);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $html = curl_exec($ch);
        $link = "link='".curl_getinfo($ch,CURLINFO_EFFECTIVE_URL)."'";
        curl_close($ch);
    }//if
    else{
        $link = 'link="'.$link.'"';
    }//else

    if(isset($_GET['All'])){
        $q .= "START link=node:links(".$link."),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH link<-[:LINKED]-twt ";
        $q = extraMatches($q);
        $q .= "WHERE ows<-[:TAGGED]-twt-[:TAGGED]->anon ";
    }//if
    else if(isset($_GET['ows'])){
        $q .= "START link=node:links(".$link."),ows=node:tags(tag='ows') ";
        $q = extraTags($q);
        $q .= "MATCH link<-[:LINKED]-twt ";
        $q = extraMatches($q);
        $q .= "WHERE ows<-[:TAGGED]-twt ";
    }//elif
    else if(isset($_GET['anon'])){
        $q .= "START link=node:links(".$link."),anon=node:tags(tag='anonymous') ";
        $q = extraTags($q);
        $q .= "MATCH link<-[:LINKED]-twt ";
        $q = extraMatches($q);
        $q .= "WHERE anon<-[:TAGGED]-twt ";
    }//elif

    $q = dateTimeRange($q,false);

    $q .= "RETURN twt.date AS date ORDER BY date ASC";

    $query = array("query" => $q);

}//elif
else if(isset($_GET['singleTagDate'])){
//get the tweet times associated with a single tag
    $q = "";
    $tag = urldecode($_GET['singleTagDate']);

    if(isset($_GET['All'])){
        if($tag=="anonymous"){
            $q .= "START ows=node:tags(tag='ows'),tag=node:tags(tag='anonymous') ";
            $q .= "MATCH ows<-[:TAGGED]-twt-[t:TAGGED]->tag ";
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            $q .= "MATCH tag<-[t:TAGGED]-twt-[:TAGGED]->anon ";
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),ows=node:tags(tag='ows'),anon=node:tags(tag='anonymous') ";
            $q .= "MATCH ows<-[:TAGGED]-twt-[:TAGGED]->anon,tag<-[t:TAGGED]-twt ";
        }//else
    }//if
    else if(isset($_GET['ows'])){
        if($tag=="anonymous"){
            $q .= "START tag=node:tags(tag='anonymous') ";
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows') ";
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),ows=node:tags(tag='ows') ";
            $q .= "MATCH ows<-[:TAGGED]-twt,tag<-[t:TAGGED]-twt ";
        }//else
    }//elif
    else if(isset($_GET['anon'])){
        if($tag=="anonymous"){
            $q .= "START tag=node:tags(tag='anonymous') ";
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
        }//if
        else if($tag=='ows'){
            $q .= "START tag=node:tags(tag='ows') ";
            $q .= "MATCH tag<-[t:TAGGED]-twt ";
        }//elif
        else{
            $q .= "START tag=node:tags(tag='".$tag."'),anon=node:tags(tag='anonymous') ";
            $q .= "MATCH anon<-[:TAGGED]-twt,tag<-[t:TAGGED]-twt ";
        }//else
    }//elif

    $q = dateTimeRange($q,true);

    $q .= "RETURN twt.date AS date ORDER BY date ASC";

    $query = array("query" => $q);

}//elif

//if we have a query to execute, request it
if(isset($query)){
    $result = request($query);
    //do a test to see if no retweets exsisted
    //if there wern't any then go get standard tweets
    if(isset($_GET['tweets'])){
        $chk = json_decode($result);
        if(!isset($chk->data[0][0])){
            $q = tweets(1);
            $query = array("query" => $q);
            $result = request($query);
            echo $result;
        }//if
        else{
            echo $result;
        }//else
    }//if
    else{
        //print our json
        echo $result;
    }//else
}//if
else{
    echo 'no query';
}//else


?>
