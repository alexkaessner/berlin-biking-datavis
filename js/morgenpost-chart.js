// set the dimensions and margins of the graph
var MP_margin = {top: 10, right: -55, bottom: 0, left: 00},
    MP_width = 670 - MP_margin.left - MP_margin.right,
    MP_height = 200 - MP_margin.top - MP_margin.bottom;

// set the ranges
var MP_x = d3.scaleBand().range([0, MP_width])
				.padding(0);
var MP_y = d3.scaleLinear().range([MP_height, 0]);

// define the area
var MP_area = d3.area()
		.curve(d3.curveNatural)
    .x(function(d) { return MP_x(d.safetylevel); })
    .y0(MP_height)
    .y1(function(d) { return MP_y(d.votes); });

// define the line
var valueline = d3.line()
		.curve(d3.curveNatural)
    .x(function(d) { return MP_x(d.safetylevel); })
    .y(function(d) { return MP_y(d.votes); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left MP_margin
var MP_svg = d3.select("#morgenpost-chart").append("svg")
    .attr("width", MP_width + MP_margin.left + MP_margin.right)
    .attr("height", MP_height + MP_margin.top + MP_margin.bottom)
  .append("g")
    .attr("transform", "translate(" + MP_margin.left + "," + MP_margin.top + ")");

// get the data
d3.csv("../data/morgenpost-chart.csv", function(error, data) {
  if (error) throw error;

	// create the gradient for the chart
	MP_svg.append("linearGradient")
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
  MP_x.domain(data.map(function(d){ return d.safetylevel }));
  MP_y.domain([0, d3.max(data, function(d) { return d.votes; })]);

  // add the area
    MP_svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", MP_area);

});
