//add style elements
var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;

//var color = d3.scaleOrdinal(d3.schemeCategory10);

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%H:%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

function updateData(data, hasOld) {
	
	var source1 = parseInt(document.getElementById("source1").value);
	var source2 = parseInt(document.getElementById("source2").value);
	var source3 = parseInt(document.getElementById("source3").value);

	// Removes the old chart.
	if (hasOld) {
		d3.select("svg").remove();
	}

	var newData = data.slice(-50);

	// format the data
	newData.forEach(function(d) {
	  d.date = parseTime(d.time);
		d.value1 = +d.data[0][source1];
		d.value2 = +d.data[1][source2];
		d.value3 = +d.data[2][source3];
		d.max = Math.max(d.value1,d.value2,d.value3);
	});

	// append the svg obgect to the body of the page
	var svg = d3.select("#chart").append("svg")
		.datum(newData)
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	// Scale the range of the data
	x.domain(d3.extent(newData, function(d) { return d.date; }));
	y.domain([0, d3.max(newData, function(d) { return d.max; })]);

	// define the line
	var valueline1 = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value1); })
			.curve(d3.curveMonotoneX);
			
	var valueline2 = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value2); })
			.curve(d3.curveMonotoneX);
			
	var valueline3 = d3.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.value3); })
			.curve(d3.curveMonotoneX);

	// Add the valueline path.
	svg.append("path")
	  .data([newData])
	  .attr("class", "line")
		.attr("d", valueline1)
		.style('stroke', 'orange')
  	.style('opacity', lineOpacity)
		
	svg.append("path")
	  .data([newData])
	  .attr("class", "line")
		.attr("d", valueline2)
		.style('stroke', 'steelblue')
  	.style('opacity', lineOpacity)


	svg.append("path")
	  .data([newData])
	  .attr("class", "line")
		.attr("d", valueline3)
		.style('stroke', 'green')
  	.style('opacity', lineOpacity)

	xAxis = d3.axisBottom(x);
	yAxis = d3.axisLeft(y);

	// Add the X Axis
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	// Add the Y Axis
	svg.append("g")
		.call(yAxis);

	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height -6)
		.text("Time");
		
	svg.append("text")
		.attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", margin.left+20)
		.attr("y", margin.top/2)
		.attr("dy", ".75em")
		.attr("transform", "rotate(0)")
		.text("Amplitude");

}
