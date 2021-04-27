#!/bin/bash 
ip="www.google.com"
data="date +%y-%m-%d"
data=$(echo $($data))
time=$(date +%X)
if ping -c 1 $ip &> /dev/null; then
  mkdir $data

	backupList=~/.backup_list.txt
	while IFS= read -r line
	do
 		cp -r $line ./$data
	done < "$backupList"

  tar -czf "$data.tar.gz" ./$data

  rm -r $data/
  mv "$data.tar.gz" ~/OneDrive/Linux/Manjaro/backups/
  touch ~/Desktop/'News'
  echo "OK: backup successded on $data, $time" >> ~/Desktop/'News'
else
  touch ~/Desktop/'Errors log'
  echo "Error: backup failed on $data, $time" >> ~/Desktop/'Errors log'
fi

