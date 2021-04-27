#!/bin/bash
#Open Agenda
adb shell input touchscreen swipe 100 1300 100 1300 5

#Select search bar
adb shell input touchscreen swipe 100 100 100 100 5
sleep 1

#Type "Walli"
adb shell input touchscreen swipe 100 1020 100 1020 1
adb shell input touchscreen swipe 70 1120 70 1120 1
adb shell input touchscreen swipe 650 1150 650 1150 1
adb shell input touchscreen swipe 650 1150 650 1150 1
adb shell input touchscreen swipe 550 1020 550 1020 1

#Call him
adb shell input touchscreen swipe 650 300 650 300 1
