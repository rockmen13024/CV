#!/usr/bin/env python3

from ppadb.client import Client
import time
import sys

adb = Client(host='127.0.0.1', port=5037)
devices = adb.devices()

if len(devices) == 0:
    print('no device attached')
    quit()

device = devices[0]
while True:
    #Start
    device.shell('input touchscreen tap 1300 600')
    time.sleep(2.5)
    #Select friend
    device.shell('input touchscreen tap 300 300')
    time.sleep(3)
    #Battle
    device.shell('input touchscreen tap 1270 670')
    time.sleep(8)
    #Auto attack
    device.shell('input touchscreen tap 250 40')
    time.sleep(int(sys.argv[1]))
    print('off')
    #Collect
    device.shell('input touchscreen tap 960 625')
    time.sleep(3)
    #No friend
    device.shell('input touchscreen tap 750 650')
    time.sleep(4)

print('it works')

