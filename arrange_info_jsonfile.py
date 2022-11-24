import json

data = json.load(open('data/prod/total_producao-2.json', 'r'))
l = []
STARTING_YEAR = 1990


#for i in data:
#    d = {}
#    for k, v in i.items():
#        k = k.split(" - ")[1]
#        d[k] = v
#    l.append(d)


json_final = {}


for i in data:
    print("entrei")
    lista = []
    for k,v in i.items():
        d = {}
        d["Country"] = k
        d["Energy"] = v
        lista.append(d)        
    json_final[str(STARTING_YEAR)] = lista
    STARTING_YEAR += 1

print(json_final)

with open('data/prod/total_producao-2-2.json', 'w') as outfile:
    outfile.write(str(json_final))
