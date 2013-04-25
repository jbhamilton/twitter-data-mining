Data Mining twitter: Insight into the #ows and #anonymous communities

View the code live and working at http://www.bradleyhamilton.com/projects/twitter/index.html

Using Twitters public API coupled with python, neo4j, and JavaScript the mining of specific hash tags can be achieved and subsequently eloquently displayed for interactive analysis. Using this methodology the hash tags #ows and #anonymous were mined for three months which resulted in 
~ 200,000 tweets being collected for analysis. An application was developed to provide context analysis, drilling down, and rolling up functionality across the data set of tweets.


The application allows for the functionality of :
	analyzing multiple tags for comparison 
	analyzing single tags individually 
	Drilling down to date ranges and specific time ranges of day
	Viewing the major entities of the tweets in context including :
		Tags
		Links
		Tweets
		Users
	Visualization of trends including:
		Tags use through time
		Links use through time
		Tag usage comparison

Python
	Python was used to perform the “ETL (Extract Transform Load)” process from Twitters public API for the collection, preprocessing, manipulation, and loading of the tweets data.
	neo4j embedded
		Python module to integrate Neo4js Java service
	python twitter
		Python module which provides a simple API to twitters public API

Neo4j
	Neo4j is a graph data base. You may not have heard of a graph database but it functions in the sense that it is essentially a giant linked list with entities of the graph as nodes with distinct relationships connecting the nodes. These are ideal for modeling social networking relationships and Tweeting.

Shell Scripts and CRON jobs
	CRON jobs were used to automate the mining process in cooperation with some basic shell scripts to provide logging functionality.

JavaScript
	JavaScript was used to build and provide the application interface including visualizations.
	D3.js
		D3 was used to do the visualizations within the application which included:
			Tag visualization using node packing and relative sizing
			Line charts
			Pie charts
PHP
	PHP was used as the applications data gateway and portal on the server. It provides the middle man between the JavaScript which requests and formats the data and the server that provides the data.


The application was developed solely on Linux (Debian based) but with the dependencies fulfilled it should function on any machine that satisfies the minimum hardware requirements.

Will run on 32bit and 64bit machines as long as dependencies are installed as appropriate.

Hardware Requirements

Ram
	8GB - For full working data set that is included with project.
	512Mb – For small sample dataset.

Processor
	Any

Python dependencies
	python twitter http://code.google.com/p/python-twitter/
	neo4j embedded http://www.neo4j.org/download/linux
	urllib2 

JavaScript dependencies
	d3.js library https://github.com/mbostock/d3

Neo4j server dependencies
	headless server http://docs.neo4j.org/chunked/stable/server-installation.html

It is necessary to tweak the configuration files of neo4j in order to gain enhanced performance from the database. This list of steps for full optimization can be found here: http://docs.neo4j.org/chunked/stable/operations.html. 
The most important tweak through is in the neo4j-wrapper.conf file which is located on Linux machines at /var/lib/neo4j/conf/ . Since Neo4j runs on top of Java it directly gets declared a working heap size in memory when it is started. Change the line that contains  wrapper.java.initmemory=64  and allow for as much working memory as your machine can afford (this is in Mb).
