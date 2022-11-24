
        

if __name__ == '__main__':
    
    f = open("data/producao/pordata-2-5.csv", "r")
    w = open("data/producao/pordata-2-5-2.csv", "w")
    for line in f.readlines():
        line = line.replace("\"", "")
        print(line , "\n")
        print()
        
        for i in range(0, 10):
            line = line.replace("  ", " ")
        
        w.write(line)
    
    f.close()


