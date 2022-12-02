function countryColor(selectValue) {
    var myColor = d3.scale.linear()
        .domain(d3.extent(selectData, function (d) { return d.Energy; }))
        .range(["blue", "green"]);
    return myColor(selectValue)
}

function loadData(data) {
    var selectData;
    d3.json("data/prod/total/total_producao.json", function (error, data) {
        if (error) {
            console.warn(error);
        }
        var year = 2020;
        selectData = data[year];
        loadMap();
    });
}

function loadMap(geo_path) {
    document.getElementById('subtheme').disabled = true;
    document.getElementById('minyearSelect').disabled = true;
    document.getElementById('maxyearSelect').disabled = true;
    document.getElementById('toggle').disabled = true;

    var countrydiv = d3.select("#container").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    
    var h = parseFloat(document.getElementById("form").offsetHeight - document.getElementById("mapTitle").offsetHeight - 40);

    var svg = d3.select("#container")
        .append("svg")
        .attr("width", "100%")
        .attr("id","svg1")
        .attr("height", h);

    var w = parseFloat(svg.style("width"));

    var projection = d3.geo.mercator()
        .center([7, 52])
        .translate([w / 2, h / 2])
        .scale([w / 1.5]);

    var path = d3.geo.path()
        .projection(projection);

    svg.selectAll("path")
        .data(geo_path.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "rgba(0, 0, 0, 0.4)")
        .attr("opacity", 0.3)
        .attr("fill", function (d) {
            var color = "white"
            return color
        })
        .attr("class", d => d.properties.name)
        .on("click", function (d) {
            localStorage.setItem("country", d.properties.name);
            localStorage.setItem("year", 2020);
            location.href='details.htm'
        })
        .on("mouseover", function (d) {
            countrydiv.style("opacity", 1);
        })
        .on("mousemove", function (d) {
            themeData = getThemeData();
            countryValue = "No data";
            if (themeData != undefined) {
                for (var i = 0; i < themeData.length; i++) {
                    if (themeData[i].Country == d.properties.name) {
                        countryValue = themeData[i].Energy;
                        break;
                    }
                }
            }
            countrydiv.html(d.properties.name + ": " + countryValue)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on("mouseleave", function (d) {
            countrydiv.style("opacity", 0)
        });
}
