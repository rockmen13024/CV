### What?
Homework link https://ocw.cs.pub.ro/courses/alf/teme/tema_en_2

### Purpose
The purpose of the homework is to write an interpreter for the Design language. The language is used to draw geometric figures and and points.

Write an interpreter that receives a file with statements as parameter and writes a SVG file. If there was an error, it will output ERROR LINE followed by the line number: and the error text.

### Using
tsc index.ts
node index.js design.dsn canvas.svg

### How to use?
In the .dsn file have to write one or more of the commands:
    &This is a comment
    POSITION: x y - Moves the pen to a position, without drawing anything.
    LINE: x y type - Draws a line from the current position to a specified position or length and angle. 
                     This will be the new position of the pen.
        type has to be one of:
            location - draws to x, y 
            polar - x is the length of the circle, y is the angle of the cercle. It calculates x and y and makes a line there.
    CIRCLE: x y r - Draw a circle. This does not move the current position.
        r - radius
    ELLIPSE: x y r1 r2 - Draw an ellipse. This does not move the current position.
        r1 - radius 1
        r2 - radius 2
    RECTANGLE: x1 y1 x2 y2 - Draw a rectangle. This does not move the current position.
    COLOR: type r g b - Selects the drawing color.
        type has to be one of:
            pen - changes the color of the pen.
            fill - changes the fill of the form.
     
    Variables have the following format:
        %variable
    SET: variable value - Set the value of a variable
    ADD: variable value - Add a value to the value of a variable
    SUB: variable value - Subtract a value from the value of a variable
    MUL: variable value - Multiply a variable's value with a value
    DIV: variable value - Divide the value of a variable with a value
    IDIV: variable value - Divide the value of a variable with a value (integer value)
    MOD: variable value - The remainder of the division of a variable with a value

    LOOP: times - Repeats some lines of statements until REPEAT
    WHILE: variable - Repeats some lines of statements until REPEAT
        variable - a variable, if the variable is different from 0, repeat the statements up to REPEAT
    REPEAT - Ends a loop or a while 

    ** All of the above have specific exceptions implemented.
### Solving
For solving this homework, I extracted from the file given as a paramter, an array of rows which I executed using command Cmd.exe(rand[i]).
I created the Class Cmd, so the code can look more elegant and so I can manage the errors and commands.
In Exe I extracted each word using a regex, and i created a switch with each possible command. Those commands were wrote as methods of the class.
I created the methods file_init() and file_end() for adding the start or the end of the file svg file.


