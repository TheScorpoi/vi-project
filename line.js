function line(data,selectCountrys,minyear,maxyear,){
    d3.select("#svg2").remove();
    var colors=["Purple","LemonChiffon","Snow","RoyalBlue","Goldenrod","Gray","SaddleBrown","AliceBlue","LightCoral","AntiqueWhite","DarkOrchid","BlueViolet","Cyan","Salmon","DeepSkyBlue","MediumTurquoise","DarkSeaGreen","IndianRed","Olive","DodgerBlue","Indigo","Orange","PapayaWhip","Yellow","Coral","Violet","Wheat","DarkTurquoise","DarkOliveGreen","SandyBrown"];
   
    var maxEnergy = 0;
    var cities  = [];
    selectC = new Set();
    selectCountrys.forEach((selectCountry) => {
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
    })
            

    var parseDate = d3.time.format("%m/%d/%Y").parse;

    var margin = {left: 50, right: 20, top: 20, bottom: 50 };

    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;


    var max = 0;

    var xNudge = 50;
    var yNudge = 20;

    var minDate = minyear;
    var maxDate = maxyear;


    var countrydiv = d3.select("#container2").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 1);

       
        max =  d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
        // minDate = d3.min(rows, function(d) {return d.date; });
        // maxDate = d3.max(rows, function(d) { return d.date; });		
        console.log(cities)
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
                        .tickFormat(d3.format("d"));
        
        var line = d3.svg.line()
            .x(function(d){ return x(d.date); })
            .y(function(d){ return y(d.energy); })
            .interpolate("monotone");
        
        var svg = d3.select("#container2").append("svg").attr("id","svg2").attr("height","500").attr("width","1000");
        
        var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");
        
        // chartGroup.append("path")
        //     .attr("class","line")
        //     .attr("d",function(d){
        //         console.log(rows) 
        //         return line(rows); })		
        

        chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate(0,"+height+")")
            .call(xAxis);
            
        chartGroup.append("g")
            .attr("class","axis y")
            .call(yAxis);

        var city = chartGroup.selectAll(".city")
            .data(cities)
            .enter().append("g")
              .attr("class", "city")
              
        var cont = 0;
          // Create a <path> element inside of each city <g>
          // Use line generator function to convert 366 data points into SVG path string
          city.append("path")
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
            

          // Append text to each city's <g>
          // Data join using function to access and create a new data structure based on inherited data structure
          // Note:
          //   - d.values[d.values.length gives us the last element of the 366 element arrayF4A460
          // This helps us to figure out how to correctly place city line text labels
          city.append("text")
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { 
                return "translate(" + x(d.value.date) + "," + y(d.value.energy) + ")"; })
              .attr("x", 3)
              .attr("dy", "0.35em")
              .style("font", "10px sans-serif")
              .text(function(d) { return d.id; });
            
}
