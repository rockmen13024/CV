"use strict";
exports.__esModule = true;
var fs = require("fs");
var args = process.argv;
var file_to_write = args[3];
var file_to_read = args[2];
var error_file = args[2].split(".")[0] + ".out";
var rows = [];
var file_content;
try {
    file_content = fs.readFileSync(file_to_read, 'ascii');
    rows = file_content.split(/\r?\n/);
}
catch (e) {
    console.log(e);
}
var Cmd = /** @class */ (function () {
    function Cmd() {
    }
    Cmd.file_init = function () {
        var st = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
        fs.writeFileSync(file_to_write, st);
        st = "\n<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"1024\" height=\"768\">";
        fs.appendFileSync(file_to_write, st);
    };
    Cmd.val_asgn = function (match, i) {
        if (match[i][0] == "%") {
            if (Cmd.vars[match[i]] === undefined)
                throw new Error("U," + match[i] + "," + i);
            else
                return Cmd.vars[match[i]];
        }
        var x = parseInt(match[i], 10);
        if (isNaN(x))
            throw new Error("X," + match[i] + "," + i);
        return parseInt(match[i], 10);
    };
    Cmd.error_file_init = function () {
        fs.writeFileSync(error_file, '');
    };
    Cmd.file_end = function () {
        var st = "\n</svg>";
        fs.appendFileSync(file_to_write, st);
    };
    Cmd.file_append = function (st) {
        fs.appendFileSync(file_to_write, st);
    };
    Cmd.error_file_append = function (st) {
        fs.appendFileSync(error_file, st);
    };
    Cmd.exe = function (row) {
        Cmd.line++;
        if (row[0] == "&") {
            throw new Error("Comment");
        }
        var regex = /[A-Za-z0-9\%]+/g;
        var match = row.match(regex);
        if (match != null)
            switch (match[0]) {
                case "COLOR":
                    Cmd.COLOR(match);
                    break;
                case "RECTANGLE":
                    Cmd.RECTANGLE(match);
                    break;
                case "CIRCLE":
                    Cmd.CIRCLE(match);
                    break;
                case "LINE":
                    Cmd.LINE(match);
                    break;
                case "ELLIPSE":
                    Cmd.ELLIPSE(match);
                    break;
                case "POSITION":
                    Cmd.POSITION(match);
                    break;
                case "SET":
                    Cmd.SET(match);
                    break;
                case "ADD":
                    Cmd.ADD(match);
                    break;
                case "SUB":
                    Cmd.SUB(match);
                    break;
                case "MUL":
                    Cmd.MUL(match);
                    break;
                case "DIV":
                    Cmd.DIV(match);
                    break;
                case "IDIV":
                    Cmd.IDIV(match);
                    break;
                case "MOD":
                    Cmd.MOD(match);
                    break;
                case "LOOP":
                    Cmd.LOOP(match);
                    break;
                case "REPEAT":
                    Cmd.REPEAT(match);
                    break;
                case "WHILE":
                    Cmd.WHILE(match);
                    break;
                case "IF":
                    Cmd.IF(match);
                case "END":
                    break;
                default:
                    break;
            }
    };
    Cmd.POSITION = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): POSITION has 2 parameters, you wrote " + (match.length - 1));
        try {
            Cmd.x = Cmd.val_asgn(match, 1);
            Cmd.y = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): POSITION parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var st = "\n <!-- position " + Cmd.x + ", " + Cmd.y + " -->";
        Cmd.file_append(st);
    };
    Cmd.COLOR = function (match) {
        if (match.length - 1 != 4)
            throw new Error("ERROR LINE (" + Cmd.line + "): COLOR has 4 parameters, you wrote " + (match.length - 1));
        var red, blue, green;
        try {
            red = Cmd.val_asgn(match, 2);
            blue = Cmd.val_asgn(match, 3);
            green = Cmd.val_asgn(match, 4);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): COLOR parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var type;
        if (Cmd.vars[match[1]] !== undefined)
            type = Cmd.vars[match[1]];
        else
            type = match[1];
        if (type != "pen")
            if (type != "fill")
                throw new Error("ERROR LINE (" + Cmd.line + "): COLOR parameter 1 needs to be one of (pen, fill), you wrote " + match[1]);
        if (red > 255 || red < 0)
            throw new Error("ERROR LINE " + Cmd.line + ": COLOR parameter 2 \n                requires a number or a variable between [0, 255], you wrote " + red);
        if (blue > 255 || blue < 0)
            throw new Error("ERROR LINE " + Cmd.line + ": COLOR parameter 3 \n                requires a number or a variable between [0, 255], you wrote " + blue);
        if (green > 255 || green < 0)
            throw new Error("ERROR LINE " + Cmd.line + ": COLOR parameter 4 \n                requires a number or a variable between [0, 255], you wrote " + green);
        var st;
        switch (type) {
            case "pen":
                Cmd.pen_color = "rgb(" + red + "," + blue + "," + green + ")";
                st = "\n <!-- pen " + red + ", " + blue + ", " + green + " -->";
                Cmd.file_append(st);
                break;
            case "fill":
                Cmd.fill_color = "rgb(" + red + "," + blue + "," + green + ")";
                st = "\n <!-- fill " + red + ", " + blue + ", " + green + " -->";
                Cmd.file_append(st);
                break;
            default:
                throw new Error("ERROR LINE (" + Cmd.line + "): COLOR parameter 1 needs to be one of (pen, fill), you wrote " + match[1]);
        }
    };
    Cmd.RECTANGLE = function (match) {
        if (match.length - 1 != 4)
            throw new Error("ERROR LINE (" + Cmd.line + "): RECTANGLE has 4 parameters, you wrote " + (match.length - 1));
        var x1, x2, y1, y2;
        try {
            x1 = Cmd.val_asgn(match, 1);
            y1 = Cmd.val_asgn(match, 2);
            x2 = Cmd.val_asgn(match, 3);
            y2 = Cmd.val_asgn(match, 4);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): RECTANGLE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var st = "\n <polygon points=\"" + x1 + "," + y1 + " " + x2 + "," + y1 + " " + x2 + "," + y2 + " " + x1 + "," + y2 + "\" stroke=\"" + Cmd.pen_color + "\"  stroke-width=\"1\"  fill=\"" + Cmd.fill_color + "\"/>";
        Cmd.file_append(st);
    };
    Cmd.LINE = function (match) {
        if (match.length - 1 != 3)
            throw new Error("ERROR LINE (" + Cmd.line + "): LINE has 3 parameters, you wrote " + (match.length - 1));
        var type;
        if (Cmd.vars[match[3]] !== undefined)
            type = Cmd.vars[match[3]];
        else
            type = match[3];
        var st;
        switch (type) {
            case "location":
                var x = void 0, y = void 0;
                try {
                    x = Cmd.val_asgn(match, 1);
                    y = Cmd.val_asgn(match, 2);
                }
                catch (e) {
                    var er = e.message.split(',');
                    if (er[0] == 'X')
                        throw new Error("ERROR LINE (" + Cmd.line + "): LINE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
                    throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
                }
                st = "\n <line x1=\"" + Cmd.x + "\" y1=\"" + Cmd.y + "\" x2=\"" + x + "\" y2=\"" + y + "\" stroke=\"" + Cmd.pen_color + "\"  stroke-width=\"1\" />";
                Cmd.x = x;
                Cmd.y = y;
                Cmd.file_append(st);
                break;
            case "polar":
                var l = void 0, o = void 0;
                try {
                    l = Cmd.val_asgn(match, 1);
                    o = Cmd.val_asgn(match, 2);
                }
                catch (e) {
                    var er = e.message.split(',');
                    if (er[0] == 'X')
                        throw new Error("ERROR LINE (" + Cmd.line + "): LINE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
                    throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
                }
                ;
                var rad = o / 180 * Math.PI;
                o = Cmd.y - Math.round(l * Math.sin(rad));
                l = Cmd.x + Math.round(l * Math.cos(rad));
                st = "\n <line x1=\"" + Cmd.x + "\" y1=\"" + Cmd.y + "\" x2=\"" + l + "\" y2=\"" + o + "\" stroke=\"" + Cmd.pen_color + "\"  stroke-width=\"1\" />";
                Cmd.x = l;
                Cmd.y = o;
                Cmd.file_append(st);
                break;
            default:
                throw new Error("ERROR LINE (" + Cmd.line + "): LINE parameter 3 needs to be one of (location, polar), you wrote " + match[3]);
        }
    };
    Cmd.CIRCLE = function (match) {
        if (match.length - 1 != 3)
            throw new Error("ERROR LINE (" + Cmd.line + "): RECTANGLE has 3 parameters, you wrote " + (match.length - 1));
        var cx;
        var cy;
        var r;
        try {
            cx = Cmd.val_asgn(match, 1);
            cy = Cmd.val_asgn(match, 2);
            r = Cmd.val_asgn(match, 3);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): CIRCLE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var st = "\n <circle cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"" + r + "\" stroke=\"" + Cmd.pen_color + "\"  stroke-width=\"1\" fill=\"" + Cmd.fill_color + "\"/>";
        Cmd.file_append(st);
    };
    Cmd.ELLIPSE = function (match) {
        if (match.length - 1 != 4)
            throw new Error("ERROR LINE (" + Cmd.line + "): ELLIPSE has 4 parameters, you wrote " + (match.length - 1));
        var cx, cy, rx, ry;
        try {
            cx = Cmd.val_asgn(match, 1);
            cy = Cmd.val_asgn(match, 2);
            rx = Cmd.val_asgn(match, 3);
            ry = Cmd.val_asgn(match, 4);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): ELLIPSE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var st = "\n <ellipse cx=\"" + cx + "\" cy=\"" + cy + "\" rx=\"" + rx + "\" ry=\"" + ry + "\" stroke=\"" + Cmd.pen_color + "\"  stroke-width=\"1\" fill=\"" + Cmd.fill_color + "\"/>";
        Cmd.file_append(st);
    };
    Cmd.SET = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): SET has 2 parameters, you wrote " + (match.length - 1));
        var name = match[1];
        var value;
        try {
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): SET parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var v = parseInt(value, 10);
        if (name[0] != "%")
            throw new Error("ERROR LINE (" + Cmd.line + "): SET parameter 1 requires a variable, you wrote " + name);
        if (value[0] == "%" || v === undefined)
            throw new Error("ERROR LINE (" + Cmd.line + "): SET parameter 2 requires a number or a variable, you wrote " + value);
        Cmd.vars[name] = value;
        var st = "\n <!-- " + name.substr(1) + " = " + value + " -->";
        Cmd.file_append(st);
    };
    Cmd.ADD = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): ADD has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): ADD parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = parseInt(variable) + parseInt(value);
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " + " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.SUB = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): SUB has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): SUB parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = parseInt(variable) - parseInt(value);
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " - " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.MUL = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): MUL has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): MUL parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = parseInt(variable) * parseInt(value);
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " * " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.DIV = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): DIV has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): DIV parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = parseInt(variable) / parseInt(value);
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " / " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.IDIV = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): IDIV has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): IDIV parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = Math.floor(parseInt(variable) / parseInt(value));
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " / " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.MOD = function (match) {
        if (match.length - 1 != 2)
            throw new Error("ERROR LINE (" + Cmd.line + "): MOD has 2 parameters, you wrote " + (match.length - 1));
        var variable, value;
        try {
            variable = Cmd.val_asgn(match, 1);
            value = Cmd.val_asgn(match, 2);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): MOD parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        var val = parseInt(variable) % parseInt(value);
        Cmd.vars[match[1]] = val;
        var st = "\n <!-- " + match[1].substr(1) + " = " + match[1].substr(1) + " % " + value + " : " + val + " -->";
        Cmd.file_append(st);
    };
    Cmd.LOOP = function (match) {
        if (match.length - 1 != 1)
            throw new Error("ERROR LINE (" + Cmd.line + "): LOOP has 1 parameters, you wrote " + (match.length - 1));
        var times;
        Cmd.line = i + 1;
        try {
            times = Cmd.val_asgn(match, 1);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): LOOP parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        Cmd.contor++;
        var st;
        if (Cmd.contor == 0) {
            st = "\n <!-- loop " + times + ": " + times + " -->";
            Cmd.file_append(st);
            Cmd.points = i - 1;
        }
        st = "\n <!-- loop #" + Cmd.contor + " -->";
        Cmd.file_append(st);
        if (!file_content.includes("\nREPEAT"))
            throw new Error("ERROR LINE (" + Cmd.line + "): LOOP with no REPEAT");
        if (Cmd.contor == times - 1) {
            Cmd.checker = 1;
            throw new Error('Comment');
        }
    };
    Cmd.WHILE = function (match) {
        if (match.length - 1 != 1)
            throw new Error("ERROR LINE (" + Cmd.line + "): WHILE has 1 parameters, you wrote " + (match.length - 1));
        var variable;
        //Cmd.line = i;
        Cmd.line = i + 1;
        try {
            variable = Cmd.val_asgn(match, 1);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): WHILE parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        if (variable == 0) {
            Cmd.checker = 1;
            i = Cmd.pointf;
            throw new Error('Comment');
        }
        Cmd.contor++;
        var st;
        if (Cmd.contor == 0) {
            st = "\n <!-- while " + match[1].substr(1) + ": " + variable + " -->";
            Cmd.file_append(st);
            Cmd.points = i - 1;
        }
        st = "\n <!-- while #" + Cmd.contor + " " + match[1].substr(1) + ": " + variable + " -->";
        Cmd.file_append(st);
        if (!file_content.includes("\nREPEAT"))
            throw new Error("ERROR LINE (" + Cmd.line + "): WHILE with no REPEAT");
    };
    Cmd.REPEAT = function (match) {
        Cmd.pointf = i;
        if (match.length - 1 != 0)
            throw new Error("ERROR LINE (" + (Cmd.line + 1) + "): REPEAT has 0 parameters, you wrote " + (match.length - 1));
        if (Cmd.contor == -1)
            throw new Error("ERROR LINE (" + Cmd.line + "): REPEAT and no LOOP");
        i = Cmd.points;
        var st = "\n <!-- repeat -->";
        Cmd.file_append(st);
        if (Cmd.checker == 1) {
            i = Cmd.pointf;
            Cmd.contor = -1;
            Cmd.checker = 0;
            throw new Error('Comment');
        }
    };
    Cmd.IF = function (match) {
        if (match.length - 1 != 1)
            throw new Error("ERROR LINE (" + Cmd.line + "): IF has 1 parameters, you wrote " + (match.length - 1));
        if (!file_content.includes("\nEND"))
            throw new Error("ERROR LINE (" + Cmd.line + "): IF with no END");
        var variable;
        try {
            variable = Cmd.val_asgn(match, 1);
        }
        catch (e) {
            var er = e.message.split(',');
            if (er[0] == 'X')
                throw new Error("ERROR LINE (" + Cmd.line + "): IF parameter " + er[2] + " requires a number or a variable, you wrote " + er[1]);
            throw new Error("ERROR LINE (" + Cmd.line + "): Undefined variable " + er[1].substr(1));
        }
        if (variable == 0) {
            Cmd.checker = 1;
            i = Cmd.pointf;
            throw new Error('Comment');
        }
    };
    Cmd.x = 0;
    Cmd.y = 0;
    Cmd.pen_color = "rgb(0,0,0)";
    Cmd.pen_width = 1;
    Cmd.fill_color = "rgb(255,255,255)";
    Cmd.line = 0;
    Cmd.vars = {};
    Cmd.points = 0;
    Cmd.contor = -1;
    Cmd.pointf = 0;
    Cmd.checker = 0;
    return Cmd;
}());
Cmd.error_file_init();
Cmd.file_init();
var i = 0;
for (; i < rows.length; i++) {
    var row = rows[i];
    row = row.trim();
    try {
        Cmd.exe(row);
    }
    catch (err) {
        if (err.message == "Comment") {
            continue;
        }
        console.log(err.message);
        //Cmd.error_file_append(err.message);
    }
}
Cmd.file_end();
//console.log(rows);
