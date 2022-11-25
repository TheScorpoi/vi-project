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
    //Width and height
    var w = 1000;
    var h = 800;

    //Define map projection

    var projection = d3.geo.mercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
        .center([7, 52]) //comment centrer la carte, longitude, latitude
        .translate([w / 2, h / 2]) // centrer l'image obtenue dans le svg
        .scale([w / 1.5]); // zoom, plus la valeur est petit plus le zoom est gros 

    //Define path generator
    var path = d3.geo.path()
        .projection(projection);

    //Create SVG
    var svg = d3.select("#container")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
        .data(geo_path.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "rgba(0, 0, 0, 0.4)")
        .attr("fill", function (d) {
            var color = "white"
            // for (var i = 0; i < selectData.length; i++) {
            //     if (selectData[i].Country == d.properties.name) {
            //         if (selectData[i].Energy == 0) { color = "white"; }
            //         else {
            //             color = countryColor(selectData[i].Energy)
            //         }
            //         return color;
            //     }
            // }
            return color
        })
        .attr("class", d => d.properties.name)
        .on("click", function (d) {
            // d3.json("data/prod/total/total_producao.json", function (error, data) {
            // 	if (error) {
            // 		console.warn(error);
            // 	}
            // 	var year = 2020;
            // 	data = data[year];
            // 	myColor = d3.scale.linear()
            // 		.domain(d3.extent(data, function (d) { return d.Energy; }))
            // 		.range(["red", "green"])
            // 	for (var i = 0; i < data.length; i++) {
            // 		if (data[i].Country == d.properties.name) {
            // 			console.log(data[i].Country)
            // 			console.log(data[i].Energy)
            // 			if (data[i].Energy == 0) color = "#FFFFFF";
            // 			else color = myColor(data[i].Energy);
            // 			console.log(color)
            // 			boxes = d3.select("path." + d.properties.name).attr("fill", color);
            // 		}
            // 	}

            // 	let country = d.properties.name;

            // });
            console.log(d.properties.name);
        });

}
