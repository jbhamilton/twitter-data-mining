#! /bin/bash

LOG=/var/www/twitter/log/twtFarm-March.log
echo ------------------- $(date) ------------------------- >> $LOG 
python /var/www/twitter/cgi-bin/twtFarm.py >> $LOG 
echo -------------------- END RUN ------------------------- >> $LOG
