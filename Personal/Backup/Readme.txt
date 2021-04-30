Requirements:

    Rclone - If you plan to do a backup on drive. I used this tutorial to link my drive account to a directory 
            https://www.linuxuprising.com/2018/07/how-to-mount-onedrive-in-linux-using.html

    or none, if you want to do it localy or on a drive that you own

Related files:

	~/.backup_list.txt

This script makes backup after folders or files in backup_list.txt and puts them on the cloud under a name that specifies the day.
It also makes a News file and Errors log on desktop where you can find a message if it worked or failed.

I used this script to backup some files that i was working on. To make this automatic, I added the command in the crontab file.
