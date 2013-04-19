#! /bin/bash
service neo4j-service stop
rm -R /var/lib/neo4j/data/graph.db
cp -R /var/www/twitter/anon-ows-clean /var/lib/neo4j/data/graph.db
chmod 777 -R /var/lib/neo4j/data/graph.db
service neo4j-service start
