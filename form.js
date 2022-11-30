var selectCountrys  = new Set();
function formList(data) {
    // console.log(data.EUCountries)
    var listDiv = document.getElementById('list-puntate');
    var form = document.createElement("form");
    var br = document.createElement("br");
    for (var i = 0; i < data.EUCountries.length; ++i) {
        var cb = document.createElement("input");
        cb.setAttribute("id", data.EUCountries[i].Country);
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("name", "checkbox");
        cb.setAttribute("checked", "true");
        cb.setAttribute("onclick", "changeColor(this)");
        changeColor(cb);
        var label = document.createElement("label");
        label.innerHTML = data.EUCountries[i].Country;
        selectCountrys.add(data.EUCountries[i].Country);
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
                boxes = d3.select("path." + cb.id.replaceAll(" ", ".")).attr("opacity", 1);
                selectCountrys.add(cb.id);
            }
            else {
                boxes = d3.select("path." + cb.id.replaceAll(" ", ".")).attr("opacity", 0.3);
                selectCountrys.delete(cb.id);
            }
            // for (var i = 0; i < boxes.length; ++i) {
            // 	// if (boxes[i].className.baseVal == cb.name)
            // 	// 	console.log(cb.name);
            // 	// 	boxes[i].attr("fill", "red");
            // }
        });
}

var title;

function selectData() {
    year = 0;
    var x = document.getElementById("theme-select").value;
    var selectBox = document.getElementById('subtheme');
    // console.log(selectBox);
    while (selectBox.options.length > 1) {
        selectBox.remove(1);
    }
    var minyearSelect = document.getElementById('minyearSelect');
    var maxyearSelect = document.getElementById('maxyearSelect');
    while (maxyearSelect.options.length > 1) {
        maxyearSelect.remove(1);
        minyearSelect.remove(1);
    }

    var listSubTheme = [];
    switch (x) {
        case 'consumo':
            listSubTheme = ["eletrica", "gas", "petroleo", "renovaveis", "total"];
            title = "tep - Milhares";
            break;
        case "consumo_familias":
            listSubTheme = [];
            title = "kgep - Rácio";
            changeMapColor("data/" + x + "/" + x + ".json");
            break;
        case "consumo_setor":
            listSubTheme = ["agricultura", "casa", "industria", "pesca", "servicos", "transportes"];
            title = "tep - Milhares";
            break;
        case "contr_renovaveis_consumo":
            listSubTheme = [];
            title = "Proporção - %";
            changeMapColor("data/" + x + "/" + x + ".json");
            break;
        case "contr_renovaveis_producao":
            listSubTheme = [];
            title = "Proporção - %";
            changeMapColor("data/" + x + "/" + x + ".json");
            break;
        case "exportacoes":
            listSubTheme = ["comb_solidos", "eletrica", "gas", "petroleo", "renovaveis"];
            title = "tep - Milhares";
            break;
        case "importacoes":
            listSubTheme = ["comb_solidos", "eletrica", "gas", "petroleo", "renovaveis"];
            title = "tep - Milhares";
            break;
        case "preco_eletricidade":
            listSubTheme = ["domestico", "industrial"];
            title = "Euro";
            break;
        case "prod":
            listSubTheme = ["gas", "nuclear", "petroleo", "renovaveis", "total"];
            title = "tep - Milhares";
            break;
        default:
            listSubTheme = [];
            break;
    }
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
    year = 0;
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    }
}

var selData;

function getThemeData() {
    return selData;
}

var themeData;
var year = 0;
var minyear = Infinity;

function changeMapColor(path) {
    var mapTitle = document.getElementById('mapTitle');
    d3.selectAll("path").attr("fill", "white");
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    var minyearSelect = document.getElementById('minyearSelect');
    var maxyearSelect = document.getElementById('maxyearSelect');
    var listDiv = document.getElementById('list-puntate');
    fetch(path)
        .then(response => {
            return response.json();
        })
        .then(data => {
            themeData = data;
            var maxValue = 0;
            var minValue = Infinity;
            if (year == 0) {
                var minyear = Infinity;
                Object.entries(data).forEach(([key, value]) => {
                    
                    var option1 = document.createElement("option");
                    option1.setAttribute("value", key);
                    option1.innerHTML = key;
                    var option2 = document.createElement("option");
                    option2.setAttribute("value", key);
                    option2.innerHTML = key;
                    minyearSelect.append(option1);
                    maxyearSelect.append(option2);
                    year = key;
                    if(year < minyear){
                        minyear = year;
                    }
                });
                minyearSelect.value = minyear;
                maxyearSelect.value = year;
            }
            // line(data,minyear,year);
            selData = data[year];
            
            for (var i = 0; i < selData.length; ++i) {
                if (selData[i].Energy > maxValue) maxValue = selData[i].Energy;
                if (selData[i].Energy < minValue) minValue = selData[i].Energy;
                d3.select("path." + selData[i].Country.replaceAll(" ", ".")).attr("fill", countryColor(selData, selData[i].Energy));
            }
            line(data,selectCountrys,minyear,year)
            var linear = d3.scale.linear()
                .domain([minValue, maxValue])
                .range(["blue", "green"]);

            var svg = d3.select("svg");

            svg.append("g")
                .attr("class", "legendLinear")
                .attr("transform", function (d) {
                    var w = 1000 - 200;
                    var h = 800 - 200;
                    return "translate(" + w + "," + h + " )"
                });

            var legendLinear = d3.legend.color()
                .shapeWidth(30)
                .cells(10)
                .title(title)
                .orient('vertical')
                .scale(linear);

            svg.select(".legendLinear")
                .call(legendLinear);

            // maplegend.setAttribute("id", "legend")
            if (year == 0) {
                while (maxyearSelect.options.length > 1) {
                    minyearSelect.remove(1);
                    maxyearSelect.remove(1);
                }
            }
            if (y != "") {
                mapTitle.textContent = x + " " + y + " " + year;
            }
            else {
                mapTitle.textContent = x + " " + year;
            }
        });

}

function countryColor(selData, selectValue) {
    var myColor = d3.scale.linear()
        .domain(d3.extent(selData, function (d) { return d.Energy; }))
        .range(["blue", "green"]);
    return myColor(selectValue)
}

function selects() {
    var ele = document.getElementsByName('checkbox');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox') {
            ele[i].checked = true;
            boxes = d3.select("path." + ele[i].id.replaceAll(" ", ".")).attr("opacity", 1);
            selectCountrys.add(ele[i].id);
        }
    }
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    } else {
        changeMapColor("data/" + x + "/" + x + ".json");
    }
}
function deSelect() {
    var ele = document.getElementsByName('checkbox');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].type == 'checkbox') {
            ele[i].checked = false;
            boxes = d3.select("path." + ele[i].id.replaceAll(" ", ".")).attr("opacity", 0.3);
            selectCountrys.delete(ele[i].id);
        }

    }
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    } else if (x !="") {
        changeMapColor("data/" + x + "/" + x + ".json");
    }
}

function selectYear() {
    year = document.getElementById('maxyearSelect').value;
    minyear = document.getElementById('minyearSelect').value;
    console.log(year);
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    }  else if (x !="") {
        changeMapColor("data/" + x + "/" + x + ".json");
    }

}

