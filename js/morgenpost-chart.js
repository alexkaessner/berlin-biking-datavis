// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 670 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width])
				.padding(0);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area()
		.curve(d3.curveNatural)
    .x(function(d) { return x(d.safetylevel); })
    .y0(height)
    .y1(function(d) { return y(d.votes); });

// define the line
var valueline = d3.line()
		.curve(d3.curveNatural)
    .x(function(d) { return x(d.safetylevel); })
    .y(function(d) { return y(d.votes); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#morgenpost-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("../data/morgenpost-chart.csv", function(error, data) {
  if (error) throw error;

	// create the gradient for the chart
	svg.append("linearGradient")
	    .attr("id", "morgenpost-gradient")
	    .attr("gradientUnits", "userSpaceOnUse")
	    .attr("x1", 0).attr("y1", 0)
	    .attr("x2", 620).attr("y2", 0)
	  .selectAll("stop")
	    .data([
	      {offset: "0%", color: "#0ABFBC"},
				{offset: "30%", color: "#0ABFBC"},
	      {offset: "50%", color: "#5E76DC"},
				{offset: "70%", color: "#FC354C"},
	      {offset: "100%", color: "#FC354C"}
	    ])
	  .enter().append("stop")
	    .attr("offset", function(d) { return d.offset; })
	    .attr("stop-color", function(d) { return d.color; });

  // format the data
  data.forEach(function(d) {
      d.votes = +d.votes;
  });

  // scale the range of the data
  x.domain(data.map(function(d){ return d.safetylevel }));
  y.domain([0, d3.max(data, function(d) { return d.votes; })]);

  // add the area
    svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

});
