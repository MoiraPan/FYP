// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseTime = d3.time.format("%H:%M:%S").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.source1); });

// Adds the svg canvas
var svg = d3.select("#chart1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("/data/data_stored.csv", function(error, data) {

    data.forEach(function(d) {
        d.time = parseTime(d.time.toString());
        d.source = parseInt(d.source1);
        //console.log(d.source);
        //d.source1 = +d.source1;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.source; })]);
    //console.log(data);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
/*
    now = new Date()
    // Shift domain
    x.domain([now - (limit - 2) * duration, now - duration])

    // Slide x-axis left
    axis.transition()
        .duration(duration)
        .ease('linear')
        .call(x.axis)

    // Slide paths left
    paths.attr('transform', null)
        .transition()
        .duration(duration)
        .ease('linear')
        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
        .each('end', tick)

    // Remove oldest data point from each group
    //for (var name in groups) {
    //    var group = groups[name]
    //    group.data.shift()
    //}
*/
});


//update chart upon input change
function updatechart() {

    var sourceno = document.getElementById("source").value;
    var datashown = "source" + sourceno;

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d[datashown]); });

    // Get the data again
    d3.csv("/data/data_stored.csv", function(error, data) {

     	data.forEach(function(d) {
    	d.time = parseTime(d.time.toString());
    	d.source = parseInt(d[datashown]);
      //console.log(d.source);
    });

    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) { return d.source; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("#chart1").transition();

    //console.log(data);
    // Make the changes
      svg.select(".line")   // change the line
          .duration(750)
          .attr("d", valueline(data));
      svg.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
      svg.select(".y.axis") // change the y axis
          .duration(750)
          .call(yAxis);
    });

 }
 setInterval(function() {
 updatechart();
 }, 500);

//limit data points
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
