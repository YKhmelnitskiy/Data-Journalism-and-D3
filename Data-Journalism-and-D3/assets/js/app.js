// @TODO: YOUR CODE HERE!
//Defining SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

//Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 80
};

//Define dimesnions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select scatter, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right an down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// Load in the csv
d3.csv("assets/data/data.csv")
    .then(function(healthData) {
        console.log(healthData)
    healthData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });
    //Creating Scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8,d3.max(healthData, d => d.poverty)])
        .range([0,chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Creating axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    
    // Create Cirles

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", ".5");
        
    // var stateAbbreviations = chartGroup.selectAll("text")
    //     .data(healthData)
    //     .enter()
    //     .append("text")
    //     .text( function (d) { 
    //         console.log(d.abbr); 
    //         return d.abbr; 
    //     })
    //     .attr("x", d => xLinearScale(d.poverty))
    //     .attr("y", d => yLinearScale(d.healthcare))
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "6px")
    //     .attr("fill", "red");  

        var state = chartGroup.append("text")
            .style("font-size", "12px")
            .selectAll("tspan")
            .data(healthData)
            .enter()
            .append("tspan")
            .attr("x", function(d) {
          return xLinearScale(d.poverty)-8;
            })
            .attr("y", function(d) {
          return yLinearScale(d.healthcare)+5;
            })
            .text(function(d) {
          return d.abbr
            });
        
    
        
    // var text = chartGroup.selectAll("text")
    //     .data(healthData)
    //     .enter()
    //     .append("text");
    // var textLabels = text
    //     .attr("x", d => xLinearScale(d.poverty))
    //     .attr("y", d => yLinearScale(d.healthcare))
    //     .text( function (d) { return d.abbr; })
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "20px")
    //     .attr("fill", "red");                       

   //Create axes labels
   chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left +20)
        .attr("x", 0 - (chartHeight/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
});

