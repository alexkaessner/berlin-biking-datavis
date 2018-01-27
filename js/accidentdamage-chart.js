// set the dimensions and margins of the graph
var AD_margin = {top: 10, right: 0, bottom: 20, left: 30},
    AD_width = 670 - AD_margin.left - AD_margin.right,
    AD_height = 300 - AD_margin.top - AD_margin.bottom;

var AD_x = d3.scaleBand()
		.rangeRound([0, AD_width])
		.paddingInner(0.05)
		.align(0.1)

var AD_y = d3.scaleLinear()
		.rangeRound([AD_height, 0]);

var AD_z = d3.scaleOrdinal()
		.range(["#98abc5", "#6b486b", "#ff8c00"]);

// basic SVG setup
var AD_svg = d3.select("#accidentdamage-chart").append("svg")
		.attr("width", AD_width + AD_margin.left + AD_margin.right)
		.attr("height", AD_height + AD_margin.top + AD_margin.bottom)
	.append("g")
		.attr("transform", "translate(" + AD_margin.left + "," + AD_margin.top + ")");

// get the data
d3.csv("../data/accidentdamage-chart.csv", function(d, i, columns) {
	for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {

	var AD_keys = data.columns.slice(1);

	AD_x.domain(data.map(function(d) { return d.type }))
	AD_y.domain([0, d3.max(data, function(d) { return d.total })]).nice();
	AD_z.domain(AD_keys);

	AD_svg.append("g")
		.selectAll("g")
		.data(d3.stack().keys(AD_keys)(data))
    .enter().append("g")
			.attr("fill", function(d) { return AD_z(d.key); })
		.selectAll("rect")
		.data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return AD_x(d.data.type); })
      .attr("y", function(d) { return AD_y(d[1]); })
      .attr("height", function(d) { return AD_y(d[0]) - AD_y(d[1]); })
      .attr("width", AD_x.bandwidth());

	AD_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + AD_height + ")")
      .call(d3.axisBottom(AD_x));

  AD_svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(AD_y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(AD_y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");
});
