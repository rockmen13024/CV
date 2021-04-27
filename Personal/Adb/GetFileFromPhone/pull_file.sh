#!/bin/bash
ip="192.168.0.100"
#x="ping -c 1 $ip"
phone_file="sdcard/Folder"
linux_path="~"

if ping -c 1 $ip &> /dev/null; then
  adb connect $ip
  sleep 1
  adb pull $ph $linux_path
else
  echo 'It is not connected'
fi
