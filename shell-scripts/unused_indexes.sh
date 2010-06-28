#!/bin/sh

# This scripts identifies unused MyISAM and InnoDb indexes.
# It displays all indexes that have been accessed 0 times
# since start of userstat_running.
# Please note it currently ignores indexes that have been
# accesses only a few times and don't forget to run 
# userstat_running long enough for a reliable statistic
# e.g. one day or a week.
# It's a good idea to repeat usage of this script on a
# regular schedule like twice a month. You should reset
# your UserStat stats from time to time.

# This script depends on the MySQL UserStats patch from Percona:
# http://www.percona.com/docs/wiki/patches:userstatv2
# Consider using a pre patched MySQL from OurDelta.org:
# http://ourdelta.org/ (currently only 5.0 includes UserStats)

# Authors: Caspar Clemens Mierau (caspar@moviepilot.com) 
#  and Benjamin Krause (benjamin@moviepilot.com)

# License: http://creativecommons.org/licenses/by/2.0/


TABLEFILTER="#"
USAGE="usage: -d DATABASE (OR -a for all databases) [-f TABLENAMEFILTER]"

if [ "${1}" == "" ]
then	
	echo ${USAGE}
	exit 1
fi


while getopts ":d:f:a" options; do
  case $options in
    d ) DBS=$OPTARG;;
    f ) TABLEFILTER=$OPTARG;;
    a ) DBS=$(mysql --skip-column-names --batch -e "show databases;");;
    h ) echo ${USAGE};;
    \? ) echo ${USAGE}
         exit 1;;
    * ) echo ${USAGE}
	exit 1;;
  esac
done



for DB in ${DBS[@]}
do
	TABLES=$(mysql --skip-column-names --batch -e "use ${DB}; show tables;"| grep -v ${TABLEFILTER})
	for TABLE in ${TABLES[@]}
	do
		LIST=""
		LIST=$(mysql --skip-column-names --batch -e "use information_schema; select distinct(INDEX_NAME) from STATISTICS where INDEX_NAME != 'PRIMARY' and INDEX_SCHEMA = '${DB}' and table_name = '${TABLE}' and INDEX_NAME not in (select INDEX_NAME from index_statistics where INDEX_SCHEMA = '${DB}' and table_name = '${TABLE}');")
		if [ "${LIST}" != "" ] 
		then
			echo "unused indexes in table ${DB}.${TABLE}: "
			echo -e ${LIST}
			echo "---------------------------------------"
		fi
				
	done
done




