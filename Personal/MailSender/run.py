import yagmail
import os

sender = #Sender gmail user
password = #App password created on https://myaccount.google.com/security. Check "Signing to Google" section
yag = yagmail.SMTP(sender, password)

receivers = [
    #list of emails
]

subject = "Mail sent using python"
body = ["Hello,", 
        "\n", 
        "I am glad it works!", 
        "\n",
        "To this mail is attached a <a href = https://drive.google.com/file/d/1f262iNliJAQ09jJwVnuJM0iTUcrg8a-s/view>background </a>" ,
        "and because you are one of the first 100 registered participants we have a surprise for you from our partner.", 
        "\n",
        "Congratulations for being here!",
        "\n",
        "BEST regards,"
        ]

#List of files
files = ["./Test.txt"]

file = open('./mailuri_trimise.txt', 'a')
i = 1
for rec in receivers:
    files.append("./promo/{}.jpg".format(i))
    yag.send(
        to=rec,
        subject=subject,
        contents=body, 
        attachments=files,
    )
    print(rec)
    file.write("{} {} \n".format(i, rec))
    files.pop()
    i += 1
