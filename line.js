function line(data,selectCountrys,minyear,maxyear){
    d3.select("#svg2").remove();
    var colors=["Purple","LemonChiffon","Snow","RoyalBlue","Goldenrod","Gray","SaddleBrown","AliceBlue","LightCoral","AntiqueWhite","DarkOrchid","BlueViolet","Cyan","Salmon","DeepSkyBlue","MediumTurquoise","DarkSeaGreen","IndianRed","Olive","DodgerBlue","Indigo","Orange","PapayaWhip","Yellow","Coral","Violet","Wheat","DarkTurquoise","DarkOliveGreen","SandyBrown"];
    
    var maxEnergy = 0;
    var cities  = [];
    selectC = new Set();

    var ele = document.getElementsByName('checkbox');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked == true) {
            selectCountrys.add(ele[i].id);
        }
    }
    for (selectCountry of selectCountrys) {
        var v = [];
        Object.entries(data).forEach(([key, values]) => {
            if(parseInt(key) >= minyear && parseInt(key) <= maxyear){
                values.forEach((value) =>{
                    if(value.Country == selectCountry){
                        selectC.add(selectCountry);
                        if(value.Energy > maxEnergy){
                            maxEnergy = value.Energy;
                        }
                        v.push({date:parseInt(key),energy:parseFloat(value.Energy)});
                    }
                })   
            }
        })
        if(selectC.has(selectCountry)){
            cities.push({id:selectCountry,values:v})
        }
    }

    if(cities.length == 0) return;
            

    var parseDate = d3.time.format("%m/%d/%Y").parse;

    var margin = {left: 100, right: 100, top: 20, bottom: 50 };

    // var width = document.getElementById(".cont1").offsetWidth - margin.left - margin.right;
    // var height = 750 - margin.top - margin.bottom;
    var height = parseFloat(document.getElementById("form").offsetHeight - document.getElementById("mapTitle").offsetHeight );
    var max = 0;

    var xNudge = 75;
    var yNudge = 20;

    var minDate = minyear;
    var maxDate = maxyear;


    var countrydiv = d3.select("#container").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

        var svg = d3.select("#container").append("svg").attr("id","svg2").attr("height",height).attr("width","100%");

        var width = parseFloat(svg.style("width"))- margin.left - margin.right;
        
        height -=  margin.top + margin.bottom;

        max =  d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })

        z = d3.scale.ordinal(d3.schemeCategory10);
        z.domain(selectC);
        var y = d3.scale.linear()
                    .domain([0,max])
                    .range([height,0]);
        
        var x = d3.scale.linear()
                    .domain([minDate,maxDate])
                    .range([0,width]);

        
        var yAxis = d3.svg.axis()
                        .orient("left")
                        .scale(y);
                        
        var xAxis = d3.svg.axis()
                        .orient("bottom")
                        .scale(x)
                        .ticks(maxDate-minDate)
                        .tickFormat(d3.format("d"));
        
        var line = d3.svg.line()
            .x(function(d){ return x(d.date); })
            .y(function(d){ return y(d.energy); })
            .interpolate("monotone");
        
        
        
        var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");	
        
        chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate(0,"+height+")")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
            
        chartGroup.append("g")
            .attr("class","axis y")
            .call(yAxis);

        var linecountry = chartGroup.selectAll(".linecountry")
            .data(cities)
            .enter().append("g")
              .attr("class", "linecountry")
              
        var cont = 0;
        linecountry.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .attr("stroke",function(d) { 
                return colors[cont++]})
                .on("mouseover", function (d) {
                    countrydiv.style("opacity", 1);
                    countrydiv.html(d.id)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 15) + "px");
                })
                .on("mousemove", function (d) {
                    countrydiv.html(d.id)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 15) + "px");
                })
                .on("mouseleave", function (d) {
                    countrydiv.style("opacity", 0)
                });
            
        linecountry.append("text")
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { 
                return "translate(" + x(d.value.date) + "," + y(d.value.energy) + ")"; })
              .attr("x", 3)
              .attr("dy", "0.35em")
              .style("font", "10px sans-serif")
              .text(function(d) { return d.id; });

        document.getElementById("svg2").style.display = "none";
        document.getElementById("mapTitle2").style.display = "none";
}
