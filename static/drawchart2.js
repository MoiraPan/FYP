//add style elements
var lineOpacity = "0.85";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = "0.85";
var circleOpacityOnLineHover = "0.25";
var circleRadius = 3;
var circleRadiusHover = 6;

var color = d3.scaleOrdinal(d3.schemeCategory10);

// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%H:%M:%S");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg object to respective div of the page
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("class", "chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("class", "chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3
  .select("#chart3")
  .append("svg")
  .attr("class", "chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var change = 0;
var thres = 20;

function updateData(data, hasOld) {

  var source1 = parseInt(document.getElementById("source1").value);
  var source2 = parseInt(document.getElementById("source2").value);
  var source3 = parseInt(document.getElementById("source3").value);

  // Removes the old chart.
  if (hasOld) {
    d3.select("#chart svg").remove();
  }

  var newData = data.slice(-50);

  // format the data
  newData.forEach(function(d) {
    d.date = parseTime(d.time);
    d.value1 = +d.data[0][source1];
    d.value2 = +d.data[1][source2];
    d.value3 = +d.data[2][source3];
    d.max = Math.max(d.value1, d.value2, d.value3);
    d.min = Math.min(d.value1, d.value2, d.value3);
  });

  // append the svg object to the body of the page
  var svg = d3
    .select("#chart")
    .append("svg")
    .datum(newData)
    .attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(
    d3.extent(newData, function(d) {
      return d.date;
    })
  );
  y.domain([
    d3.min(newData, function(d) {
      return d.min;
    }),
    d3.max(newData, function(d) {
      return d.max;
    })
  ]);

  // define the line
  var valueline1 = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value1);
    })
    .curve(d3.curveMonotoneX);

  var valueline2 = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value2);
    })
    .curve(d3.curveMonotoneX);

  var valueline3 = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value3);
    })
    .curve(d3.curveMonotoneX);

  // Add the valueline path.
  svg
    .append("path")
    .data([newData])
    .attr("class", "line")
    .attr("d", valueline1)
    .style("stroke", "orange")
    .style("opacity", lineOpacity);

  svg
    .append("path")
    .data([newData])
    .attr("class", "line")
    .attr("d", valueline2)
    .style("stroke", "steelblue")
    .style("opacity", lineOpacity);

  svg.append("path")
    .data([newData])
    .attr("class", "line")
    .attr("d", valueline3)
    .style("stroke", "green")
    .style("opacity", lineOpacity);

svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox","-0 -5 10 10")
    .attr("refX", 6 + 3)
    .attr("refY", 2)
    .attr("markerWidth", 13)
    .attr("markerHeight", 9)
    .attr("orient", "auto")
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M2,2 L2,13 L8,7 L2,2")
    .attr('fill', '#999')
    .style('stroke','none');
    
  xAxis = d3.axisBottom(x).ticks(10);
  yAxis = d3.axisLeft(y).ticks(10);

  // Add the X Axis
  var xa = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")      
    .style("dominant-baseline", "central")
    .call(xAxis);

  // Add the Y Axis
  var ya = svg.append("g").call(yAxis);


  xa.select("path").attr("marker-end", "url(#arrow)");

  svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Time");

  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", margin.left + 50)
    .attr("y", margin.top / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(0)")
    .text("Amplitude");

//     var legend = svg.selectAll(".legend")
//     .data([newData])
//     .enter().append("g")
//     .attr("class", "legend")
//     .attr("transform", function(d, i) {
//       return "translate(0," + i * 20 + ")";
//     });

//   legend.append("rect")
//     .attr("x", width - 18)
//     .attr("width", 18)
//     .attr("height", 4)
//     .style("fill", function(d) {
//       return color(d);
//     });

//   legend.append("text")
//     .attr("x", width - 24)
//     .attr("y", 6)
//     .attr("dy", ".35em")
//     .style("text-anchor", "end")
//     .text(function(d) {
//       return d;
//     });

  analysis(data, true);
}



//   const secondChartDataModel = [
//       {
//           time:"",
//           variance:""
//       },
//   ]
//   let newDataPoint = {}
//   newDataPoint.time = "20190321"
//   newDataPoint.variance = 0.1
//   console.log("NewDataPoint:"+ newDataPoint)

// draw chart2
function analysis(data, hasOld) {
 
  var datasource = parseInt(document.getElementById("datasource").value);
  var source1 = parseInt(document.getElementById("source1").value);
  var source2 = parseInt(document.getElementById("source2").value);
  var source3 = parseInt(document.getElementById("source3").value);

  var subcarrier;

  if (datasource == 0){
      subcarrier = source1;
  }
  else if (datasource == 1){
      subcarrier = source2;
  }
  else if (datasource == 2){
      subcarrier = source3;
  }
  else {
      var txt = "invalid input";
      document.getElementById("alertbox").innerHTML = txt;
  }
  // Removes the old chart.
  if (hasOld) {
    d3.select("#chart2 svg").remove();
  }

  // format the data
  var inputData = data.slice(-60);
  var i = 0;
  var length = 10;
  var change = 0;

  inputData.forEach(function(d) {
      var range = [];
      for (j = 0; j < length; j++) {
          if (i - j < 0) {
              break;
          }
          range[j] = inputData[i - j].data[datasource][subcarrier];
      }
      d.date = parseTime(d.time);
      var vari = d3.variance(range);
      if (vari === undefined) {
          vari = 0;
      }
      d.variance = vari;
    //   if (d.variance > thres ){
    //       if (change == 0){
    //           d.stepvalue = 1;
    //       }
    //       else{
    //           d.stepvalue = 0;
    //       }
    //       change = d.stepvalue;
    //   }
    //   else{
    //     d.stepvalue = change;
    //   }
    //   console.log(d.stepvalue);
      i++;
  });
  var newData = inputData.slice(-50);
//   console.log(newData);

  // append the svg of second chart
  var svg = d3
    .select("#chart2")
    .append("svg")
    .datum(newData)
    .attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(
    d3.extent(newData, function(d) {
      return d.date;
    })
  );
  y.domain([
    d3.min(newData, function(d) {
        return d.variance;
      }),
    d3.max(newData, function(d) {
      return d.variance;
    })
  ]);

  // define the line
  var valueline = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.variance);
    });

  // Add the valueline path.
  svg.append("path")
    .data([newData])
    .attr("class", "line")
    .attr("d", valueline)
    .style("stroke", "red");

    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);
  
    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    // Add the Y Axis
    svg.append("g").call(yAxis);

    svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Time");

  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", margin.left + 50)
    .attr("y", margin.top / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(0)")
    .text("Variance");

}

function stepchart(data, hasOld){
    //get user input
    var datasource = parseInt(document.getElementById("datasource").value);
    var source1 = parseInt(document.getElementById("source1").value);
    var source2 = parseInt(document.getElementById("source2").value);
    var source3 = parseInt(document.getElementById("source3").value);

    var subcarrier;

    if (datasource == 0){
        subcarrier = source1;
    }
    else if (datasource == 1){
        subcarrier = source2;
    }
    else if (datasource == 2){
        subcarrier = source3;
    }
    else {
        var txt = "invalid input";
        document.getElementById("alertbox").innerHTML = txt;
    }

    //process data
    // Removes the old chart.
  if (hasOld) {
    d3.select("#chart3 svg").remove();
  }

  // format the data
  var inputData = data.slice(-60);
  var i = 0;
  var length = 10;
//   var change = 0;

  inputData.forEach(function(d) {
      var range = [];
      for (j = 0; j < length; j++) {
          if (i - j < 0) {
              break;
          }
          range[j] = inputData[i - j].data[datasource][subcarrier];
      }
      d.date = parseTime(d.time);
      var vari = d3.variance(range);
      if (vari === undefined) {
          vari = 0;
      }
      d.variance = vari;
      console.log(d.variance);
      if (change == undefined){
          var change = 0;
      }
      if (d.variance < thres ){
        d.stepvalue = 0;
        //   if (change == 0){
        //       d.stepvalue = 1;
        //   }
        //   else if(change == 1){
        //       d.stepvalue = 0;
        //   }
        // //   else {console.log(change);}
        //   change = d.stepvalue;
      }
      else{
        d.stepvalue = 1;
      }
      // console.log(d.stepvalue);
      i++;
  });
  var newData = inputData.slice(-50);

//append the 3rd step chart
  var svg = d3
    .select("#chart3")
    .append("svg")
    .datum(newData)
    .attr("class", "chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Scale the range of the data
  x.domain(
    d3.extent(newData, function(d) {
      return d.date;
    })
  );
  y.domain([0,2]);

  // define the line
  var valueline = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.stepvalue);
    });

  // Add the valueline path.
  svg.append("path")
    .data([newData])
    .attr("class", "line")
    .attr("d", valueline)
    .style("stroke", "red");

    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);
  
    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    // Add the Y Axis
    svg.append("g").call(yAxis);

    svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Time");

  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", margin.left + 50)
    .attr("y", margin.top / 2)
    .attr("dy", ".75em")
    .attr("transform", "rotate(0)")
    .text("Occupied");

}