//generate data
// var jsonDataArray = []
// for(var i=0; i<=6;i++){
//     var obj = {};
//     var jsondata = nj.random([3,114]);
//     obj[Date.now()] = jsondata.selection.data
//     jsonDataArray.push(obj);
// }
// console.log(jsonDataArray);


// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
width = 600 - margin.left - margin.right,
height = 270 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%H:%m:%s");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
xAxis = d3.axisBottom(x);
yAxis = d3.axisLeft(y);
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);

// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);

// Adds the svg canvas
var svg = d3.select("#chart1")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

function draw(data, source) {
    // Define the lines
var valueline = d3.svg.line()
.x(function(d) { return parseTime(d.time); })
.y(function(d) { return d.data[0][source]; });

var valueline2 = d3.svg.line()
.x(function(d) { return parseTime(d.time); })
.y(function(d) { return d.data[1][source]; });

var valueline3 = d3.svg.line()
.x(function(d) { return parseTime(d.time); })
.y(function(d) { return d.data[2][source]; });

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return parseTime(d.time); }));
y.domain([0, d3.max(data, function(d) { return d.data[0][source]; })]);

// Add the valueline path1
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// Add the valueline path2
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline2); 

// Add the valueline path3
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline3);

    // Select the section we want to apply our changes to
    var svg2 = d3.select("#chart1").transition();

    // Make the changes
      svg2.select(".line")   // change the line
          .duration(750)
          .attr("d", valueline);
      svg2.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
      svg2.select(".y.axis") // change the y axis
          .duration(750)
          .call(yAxis);
}

// /*
//     now = new Date()
//     // Shift domain
//     x.domain([now - (limit - 2) * duration, now - duration])

//     // Slide x-axis left
//     axis.transition()
//         .duration(duration)
//         .ease('linear')
//         .call(x.axis)

//     // Slide paths left
//     paths.attr('transform', null)
//         .transition()
//         .duration(duration)
//         .ease('linear')
//         .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
//         .each('end', tick)

//     // Remove oldest data point from each group
//     //for (var name in groups) {
//     //    var group = groups[name]
//     //    group.data.shift()
//     //}
// */
// });


// //update chart upon input change
// function updatechart(data) {

//     var sourceno = document.getElementById("source").value;
//     var datashown = "source" + sourceno;

//     // Define the line
//     var valueline = d3.svg.line()
//         .x(function(d) { return x(d.time); })
//         .y(function(d) { return y(d[datashown]); });

//     // Get the data again
//     d3.csv("/data", function(error, data) {
//      	data.forEach(function(d) {
//     	d.time = parseTime(d.time.toString());
//     	d.source = parseInt(d[datashown]);
//       //console.log(d.source);
//     });
    
//     var length = Math.min(data.length, 50);
//     data = data.slice(-length);

//     // Scale the range of the data again
//     x.domain(d3.extent(data, function(d) { return d.time; }));
//     y.domain([0, d3.max(data, function(d) { return d.source; })]);


//     });

//  }

// });

var socket = io.connect('http:' + '//' + document.domain + ':' + location.port + "/test");

const data = [];
const currentIndex = 0;
const limit = 100;
socket.on('server_response', res => {
    data.push(res);
    var source = document.getElementById("source").value;
    draw(data, source);
});
