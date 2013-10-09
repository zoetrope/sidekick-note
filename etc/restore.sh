#!/bin/sh

BACKUP_DIR=~/Dropbox/sidekick-note/data/
LATEST_FILE=`ls -1t $BACKUP_DIR | head -n1`

cp $BACKUP_DIR/$LATEST_FILE ./
gzip -d $LATEST_FILE
SQL_FILE=`echo $LATEST_FILE | sed -e "s/.sql.gz/.sql/"`
mysql -u root -p sidekicknote < $SQL_FILE

rm $SQL_FILE
