# SdE2 Devoir 2 - Micro:bit busybox

## Description

Link https://ocw.cs.pub.ro/courses/sde2/teme/tema_ro_2_microbit_busybox

### Purpose

This homework's purpose is implementation of a script that is able to run Linux bash like commands. It is wrote in micropython and can be run on a Microbit v2 board.

### Using
The commands that can be used are:
    
    led [parameter] x y - control the led on position x, y
        parameter can be one of:
            on - turns the led on
            off - turns the led off
            toggle - turns the led on/off
            brightness [set <val>] - prints the brightness
                set <val> - sets the value of the led
            blink <interval> <count> - blinks the led <count> times with a delay of <interval> miliseconds
    button <button> - prints the value of <button>
        button must be on of:
            A - button A
            B - button B
    light - prints the value of the light sensor
    temperature <deg> - prints the temperature
        deg muste be on of:
            C - celsius
            F - farenheit
            K - kelvin
    echo [paramter] arguments [>/>> file] - prints the arguments
        paramter can be:
            -n - doesn't print \n
        > file - write the output in file
        >> file - appents the output to the file
    cat files - concats the files and print the output
    mv source destination - move the source file to destination
    rm [option] files - removes the files if they are empty
        option can be one of:
            -r, --recursive, -R - removes the file even if it is empty
    ls [options] - list the file contents
        options can be:
            -a, --all - prints even the hidden files
            -l, --long - prints even the size of files
    cp source destination - copy the source to destination
    set <var> <value> - sets the <value> to variable <var>. <var> must start with $. Ex: $variable
        
