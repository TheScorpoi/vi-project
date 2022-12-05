var selectCountrys  = new Set();
function formList(data) {
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
    }
    listDiv.appendChild(form);
}
function changeColor(cb, name) {
    const data = fetch("./europe_features.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (cb.checked) {
                boxes = d3.select("path." + cb.id.replaceAll(" ", ".")).attr("opacity", 1);
                selectCountrys.add(cb.id);
            }
            else {
                boxes = d3.select("path." + cb.id.replaceAll(" ", ".")).attr("opacity", 0.3);
                selectCountrys.delete(cb.id);
            }
        });
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    } else if (x !="") {
        changeMapColor("data/" + x + "/" + x + ".json");
    }
}

var title;

function selectData() {
    year = 0;
    var x = document.getElementById("theme-select").value;
    var selectBox = document.getElementById('subtheme');

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
            document.getElementById('subtheme').disabled = true;
            document.getElementById('minyearSelect').disabled = false;
            document.getElementById('maxyearSelect').disabled = false;
            document.getElementById('toggle').disabled = false;
            changeMapColor("data/" + x + "/" + x + ".json");
            break;
        case "consumo_setor":
            listSubTheme = ["agricultura", "casa", "industria", "pesca", "servicos", "transportes"];
            title = "tep - Milhares";
            break;
        case "contr_renovaveis_consumo":
            listSubTheme = [];
            title = "Proporção - %";
            document.getElementById('subtheme').disabled = true;
            document.getElementById('minyearSelect').disabled = false;
            document.getElementById('maxyearSelect').disabled = false;
            document.getElementById('toggle').disabled = false;
            changeMapColor("data/" + x + "/" + x + ".json");
            break;
        case "contr_renovaveis_producao":
            listSubTheme = [];
            title = "Proporção - %";
            document.getElementById('subtheme').disabled = true;
            document.getElementById('minyearSelect').disabled = false;
            document.getElementById('maxyearSelect').disabled = false;
            document.getElementById('toggle').disabled = false;
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
    if (listSubTheme.length > 0) {
        for (var i = 0; i < listSubTheme.length; ++i) {
            var option = document.createElement("option");
            option.setAttribute("value", listSubTheme[i]);
            option.innerHTML = listSubTheme[i];
            selectBox.append(option);
        }
        document.getElementById('subtheme').disabled = false;
        document.getElementById('minyearSelect').disabled = true;
        document.getElementById('maxyearSelect').disabled = true;
        document.getElementById('toggle').disabled = true;
    }
}

function subSelectData() {
    year = 0;
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    document.getElementById('minyearSelect').disabled = false;
    document.getElementById('maxyearSelect').disabled = false;
    document.getElementById('toggle').disabled = false;
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
    // if (!document.getElementById("toggle").checked){
    //     document.getElementById("svg2").style.display = "none";
    //     document.getElementById("mapTitle2").style.display = "none";
    // }
    var mapTitle = document.getElementById('mapTitle');
    var mapTitle2 = document.getElementById('mapTitle2');
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
            year = maxyearSelect.value;
            minyear = minyearSelect.value;
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
                    var w = parseFloat(document.getElementById("container").clientWidth)-200;
                    var h = parseFloat(document.getElementById("container").clientHeight) -450;
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

            if (year == 0) {
                while (maxyearSelect.options.length > 1) {
                    minyearSelect.remove(1);
                    maxyearSelect.remove(1);
                }
            }
            if (y != "") {
                mapTitle.textContent = x + " " + y + " " + year;
                mapTitle2.textContent = x + " " + y + " " + minyear + " - " + year;
            }
            else {
                mapTitle.textContent = x + " " + year;
                mapTitle2.textContent = x + " " + minyear + " - " + year;
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
    } else if (x !="") {
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
    var x = document.getElementById("theme-select").value;
    var y = document.getElementById("subtheme").value;
    if (y != "") {
        changeMapColor("data/" + x + "/" + y + "/" + y + "_" + x + ".json");
    }  else if (x !="") {
        changeMapColor("data/" + x + "/" + x + ".json");
    }

}

