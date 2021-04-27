import RPi.GPIO as GPIO
from time import sleep

led = 12
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(led, GPIO.OUT, initial=GPIO.LOW)

#A dash is 3 time as long as a dot
#Time between each dot or dash in the same letter is equal to the duration of a dot
#Time between 2 letters is the duration of one dash
#Time between 2 words is the same duration as seven dots
morse_code = {
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----'
}

time_delay = 0.3

def represent(str):
    if str == ' ':
        GPIO.output(led, GPIO.LOW)
        sleep(time_delay*7)
        return

    for i in str:
        if i == '.':
            GPIO.output(led, GPIO.HIGH)
            sleep(time_delay)
        else:
            GPIO.output(led, GPIO.HIGH)
            sleep(time_delay*3)
        GPIO.output(led, GPIO.LOW)
        sleep(time_delay)

def start():
    while True:
        text = input("Type your string: ").upper()
        #print(text)
        encoded_text = ''
        for i in text:
            try:
                x = morse_code[i]
                #print(x)
                encoded_text += x
                #represent(x)
            except KeyError:
                if(i == '!'):
                    raise Exception('Done')
                elif(i == ' '):
                    encoded_text += '-'*7
                    #represent(' ')
                    continue
                raise Exception("Wrong char")
        print(text)
        print(encoded_text)
        represent(encoded_text)

try:
    start()
except Exception as e:
    print(e)