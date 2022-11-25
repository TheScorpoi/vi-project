function formList(data) {
    console.log(data);
    console.log(data.features[0].properties.name);
    var listDiv = document.getElementById('list-puntate');
    var form = document.createElement("form");
    var br = document.createElement("br");
    for (var i = 0; i < data.features.length; ++i) {
        var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("name", data.features[i].properties.name);
        cb.setAttribute("onclick", "changeColor(this)")

        var label = document.createElement("label");
        label.innerHTML = data.features[i].properties.name;

        form.append(cb, label, br.cloneNode());
        // var li=document.createElement('li');
        // var input=document.createElement('input');
        // input.type = "checkbox";
        // li.appendChild(input);
        // li.appendChild() = data.features[i].properties.name;   // Use innerHTML to set the text~
        // // var li = "<li>" + data.features[i].properties.name + "</li>";
        // ul.appendChild(li);                                 
    }
    listDiv.appendChild(form);
}
function changeColor(cb, name) {
    const data = fetch("./europe_features.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(d3.selectAll("path").attr("fill", "red"));
            if (cb.checked) {
                boxes = d3.select("path." + cb.name.replaceAll(" ", ".")).attr("fill", "red");
            }
            else {
                boxes = d3.select("path." + cb.name.replaceAll(" ", ".")).attr("fill", "white");
            }
            // for (var i = 0; i < boxes.length; ++i) {
            // 	// if (boxes[i].className.baseVal == cb.name)
            // 	// 	console.log(cb.name);
            // 	// 	boxes[i].attr("fill", "red");
            // }
        });
}

function selectData() {
    var x = document.getElementById("theme-select").value;
    console.log(x);
    var selectBox = document.getElementById('subtheme');
    // console.log(selectBox);
    while (selectBox.options.length > 1) {
        selectBox.remove(1);
    }

    var listSubTheme = [];
    switch (x) {
        case 'consumo': listSubTheme = ["eletrica", "gas", "petroleo", "renovaveis", "total"]; break;
        case "consumo_familias": listSubTheme = []; break;
        case "consumo_setor": listSubTheme = ["agricultura", "casa", "industria", "pesca", "servicos", "transportes"]; break;
        case "contr_renovaveis_consumo": listSubTheme = []; break;
        case "contr_renovaveis_producao": listSubTheme = []; break;
        case "preco_eletricidade": listSubTheme = ["domestico", "industrial"]; break;
        case "prod": listSubTheme = ["gas", "nuclear", "petroleo", "renovaveis", "total"]; break;
        default: listSubTheme = []; break;
    }
    console.log(listSubTheme);
    if (listSubTheme != []) {
        for (var i = 0; i < listSubTheme.length; ++i) {
            var option = document.createElement("option");
            option.setAttribute("value", listSubTheme[i]);
            option.innerHTML = listSubTheme[i];
            selectBox.append(option);
        }
    }
}

function subSelectData() {
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        console.log(x);
        console.log(y);
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    }
}

function changeMapColor(path) {
    console.log(path);
    const data = fetch(path)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var year = 2020;
            selData = data[year];
            console.log(selData);
            for (var i = 0; i < selData.length; ++i) {
                console.log(selData[i]);
                d3.select("path." + selData[i].Country.replaceAll(" ", ".")).attr("fill", countryColor(selData, selData[i].Energy));
            }
        });
}

function countryColor(selData, selectValue) {
    var myColor = d3.scale.linear()
        .domain(d3.extent(selData, function (d) { return d.Energy; }))
        .range(["blue", "green"]);
    return myColor(selectValue)
}


