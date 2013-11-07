#!/bin/sh

BACKUP_DIR=~/Dropbox/sidekick-note/data/
TODAY=`date '+%Y%m%d%H%M'`

mysqldump -u root -p --ignore-table=sidekicknote.schema_version sidekicknote | gzip > $TODAY.sql.gz
#mysqldump -u root -p --no-create-info sidekicknote | gzip > $TODAY.sql.gz
mv $TODAY.sql.gz $BACKUP_DIR
