import json

data = json.load(open('data/consumo_setor/servicos/servicos_consumo_setor.json', 'r'))
l = []
STARTING_YEAR = 1990

json_final = {}

for i in data:
    print("entrei")
    lista = []
    for k,v in i.items():
        d = {}
        d["Country"] = k.split(" - ")[1]
        d["Energy"] = v
        lista.append(d)        
    json_final[str(STARTING_YEAR)] = lista
    STARTING_YEAR += 1

print(json_final)

with open('data/consumo_setor/servicos/servicos_consumo_setor-2.json', 'w') as outfile:
    outfile.write(str(json_final))
