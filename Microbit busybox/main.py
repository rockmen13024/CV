from microbit import *
import os

class Exit(Exception):
    pass

class Commands(object):
    dic = {}
    def execute(self, str):
        self.sliced_cmd = str.split()
        for i in range(0, len(self.sliced_cmd)):
            if(self.sliced_cmd[i][0] == "$"):
                self.sliced_cmd[i] = Commands.dic[self.sliced_cmd[i][1:]]
        cmd = getattr(self, self.sliced_cmd[0], "Invalid command.")
        if(cmd == "Invalid command."):
            raise Exception("Invalid command.")
        return cmd()

    def exit(self):
        raise Exit
    
    def quit(self):
        raise Exit

    def led(self):
        aux = self.sliced_cmd[1]
        try:
            line = int(self.sliced_cmd[len(self.sliced_cmd)-2])
            col = int(self.sliced_cmd[len(self.sliced_cmd)-1])
        except Exception as e:
            raise Exception("Invalid command.")
        
        if(line > 4 or col > 4 or line < 0 or col < 0):
            if (aux == "blink"):
                #print("Invalid count value.")
                print("Invalid LED.")
            else:
                print("Invalid LED.")
            return
            #raise Exception("Invalid LED.")
        
        if(aux == "on"):
            #print("Set pixel {} {} to 9".format(self.sliced_cmd[2], self.sliced_cmd[3]))
            display.set_pixel(line, col, 9)
            return

        elif(aux == "off"):
            #print("Set pixel {} {} to 0".format(self.sliced_cmd[2], self.sliced_cmd[3]))
            display.set_pixel(line, col, 0)
            return

        elif(aux == "blink"):
            blink_delay = int(self.sliced_cmd[2])
            blink_times = int(self.sliced_cmd[3])
            if blink_times > 20 or blink_times < 0:
                raise Exception("Invalid count value.")
            for contor_for in range(blink_times):
                self.execute("led on {} {}".format(line, col))
                sleep(blink_delay)
                self.execute("led off {} {}".format(line, col))
                sleep(blink_delay)
            return

        elif(aux == "toggle"):
            if(display.get_pixel(line, col) > 0):
                self.execute("led off {} {}".format(line, col))
            else:
                self.execute("led on {} {}".format(line, col))
            return
        
        elif(aux == "brightness"):
            if(self.sliced_cmd[2] == "set"):
                val = int(self.sliced_cmd[3])
                if val > 9 or val < 0:
                    raise Exception("Invalid brightness.")
                display.set_pixel(line, col, val)
                print(display.get_pixel(line, col))
            else:
                print(display.get_pixel(line, col))
            return       
        else:
            raise("Invalid command.")
    
    def button(self):
        btn = self.sliced_cmd[1]
        if(btn == "a"):
            print(button_a.is_pressed()) 
        elif(btn == "b"):
            print(button_b.is_pressed())
        else:
            print("Invalid button.")
        return
    
    def light(self):
        print(display.read_light_level())
        return
    
    def temperature(self):
        deg = self.sliced_cmd[1]
        deg_val = temperature()
        if deg == "c":
            print(deg_val)
        elif deg == "f":
            print(deg_val * 1.8 + 32)
        elif deg == "k":
            print(273.15 + deg_val)
        return

    def ls(self):
        ops = []
        true_ops = ['-a', '--all', '-l', '--long']
        for i in range(1, len(self.sliced_cmd)):
            x = self.sliced_cmd[i]
            if x in true_ops and x not in ops:
                if len(x) > 2:
                    x = x[1:3]
                ops.append(x)
            else:
                raise Exception('Invalid command.')

        if len(ops) == 0:
            #open('.hello.txt', 'w')
            res = os.listdir()
            for i in range(0, len(res)):
                aux = res.pop()
                if(aux[0] != '.'):
                    print(aux)
            #os.remove('.hello.txt')
            return
        elif '-a' in ops and '-l' in ops:
            #open('.nanana.txt', 'w')
            res = os.listdir()
            for i in range(0, len(res)):
                aux = res.pop()
                print("{} {}".format(os.size(aux), aux))
            #os.remove('.nanana.txt')
            return
        elif '-a' in ops:
            #open('.hello.txt', 'w')
            res = os.listdir()
            for i in range(0, len(res)):
                aux = res.pop()
                print(aux)
            #os.remove('.hello.txt')
            return
        # -l
        else:
            #open('.hello.txt', 'w')
            res = os.listdir()
            for i in range(0, len(res)):
                aux = res.pop()
                if(aux[0] != '.'):
                    print("{} {}".format(os.size(aux), aux))
            #os.remove('.hello.txt')
            return

    def cat(self):
        ops = []
        for i in range(1, len(self.sliced_cmd)):
            ops.append(self.sliced_cmd[i])
        output = ""
        for i in ops:
            try:
                file = open(i, 'r') #as file
                output ="{}{}".format(output, file.read())
                file.close()
            except Exception as e:
                raise Exception('Cannot print file.')
        print(output, end="")
        return

    def cp(self):
        file1 = self.sliced_cmd[1]
        file2 = self.sliced_cmd[2]
        try:
            x = open(file1, 'r')
            output = "{}".format(x.read())
            x.close()
            y = open(file2, 'w')
            y.write(output)
            y.close()
        except Exception:
            raise Exception("Cannot copy file")

    def mv(self):
        file1 = self.sliced_cmd[1]
        file2 = self.sliced_cmd[2]
        try:
            x = open(file1, 'r')
            output = "{}".format(x.read())
            x.close()
            y = open(file2, 'w')
            y.write(output)
            y.close()
            os.remove(file1)
        except Exception:
            raise Exception("Cannot move file")

    def rm(self):
        files = []
        op = ''
        true_ops = ['-r', '-R', '--recursive']
        for i in range(1, len(self.sliced_cmd)):
            x = self.sliced_cmd[i]
            if x in true_ops:
                if op == '':
                    if len(x) > 2:
                        op = x[1:3].lower
                    else:
                        op = x
                else:
                    raise Exception('Invalid command.')
            else:
                files.append(x)
        if op == '':
            for i in files:
                if os.size(i) != 0:
                    raise Exception('Cannot remove {}. File not empty'.format(i))
                else:
                    os.remove(i)
        else:
            for i in files:
                try:
                    os.remove(i)
                except Exception:
                    raise Exception('File does not exist')

    def echo(self):
        ops = []
        for i in range(1, len(self.sliced_cmd)):
            ops.append(self.sliced_cmd[i])
        output = ""
        for i in range(0, len(ops)):
            if ops[i] == '-n':
                continue
            if ops[i] == '>':
                if ops[0] != '-n':
                    output = "{}\n".format(output)
                fi = open(ops[i+1], 'w')
                fi.write(output)
                fi.close()
                break
            if ops[i] == '>>':
                if ops[0] != '-n':
                    output = "{}\n".format(output)
                try:
                    fi = open(ops[i+1], 'r')
                    x = fi.read()
                    fi.close()
                except Exception:
                    raise Exception('Cannot append redirect')
                fi = open(ops[i+1], 'w')
                fi.write("{}{}".format(x, output))
                fi.close()
                break
            output = "{} {}".format(output, ops[i])
            #echivalent trim
            output = output.strip()
            
            if i == len(ops)-1:
                if ops[0] == '-n':
                    print(output, end = "")
                else:
                    print(output)

    def set(self):
        name = self.sliced_cmd[1]
        value = self.sliced_cmd[2]
        try:
            check = Commands.dic[name]
            raise Exception('Value is used')
        except KeyError:
            Commands.dic[name] = value
            return


def mergi():
    cmd = input("cmd: ")
    o.execute(cmd)
    
o = Commands()
while True:
    try:
        mergi()
    except Exit:
        break
    except Exception as e:
        print(TypeError(e))
