// set the dimensions and margins of the graph
var AD_margin = {top: 0, right: 10, bottom: 20, left: 52},
    AD_width = 670 - AD_margin.left - AD_margin.right,
    AD_height = 300 - AD_margin.top - AD_margin.bottom;

var AD_y = d3.scaleBand()
		.rangeRound([AD_height, 0])
		.paddingInner(0.05)
		.align(0.1)

var AD_x = d3.scaleLinear()
		.rangeRound([0, AD_width]);

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

	AD_y.domain(data.map(function(d) { return d.type }))
	AD_x.domain([0, d3.max(data, function(d) { return d.total })]).nice();
	AD_z.domain(AD_keys);

	AD_svg.append("g")
		.selectAll("g")
		.data(d3.stack().keys(AD_keys)(data))
    .enter().append("g")
			.attr("fill", function(d) { return AD_z(d.key); })
		.selectAll("rect")
		.data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return AD_y(d.data.type); })
      .attr("x", function(d) { return AD_x(d[0]); })
      .attr("width", function(d) { return AD_x(d[1]) - AD_x(d[0]); })
      .attr("height", AD_y.bandwidth())
      .on("mouseover", function() { AD_tooltip.style("display", "block"); })
      .on("mouseout", function() { AD_tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 50;
        var yPosition = d3.mouse(this)[1] - 10;
        AD_tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        AD_tooltip.select("text").text(d[1] - d[0]);
      });

	AD_svg.append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(AD_x)
						.ticks(null, "s")
						.tickSize(AD_height)
					)
			.select(".domain").remove();
	AD_svg.selectAll(".tick").attr("opacity", "0.5");
	AD_svg.selectAll(".tick:not(:first-of-type) line").attr("stroke-dasharray", "2,2");

  AD_svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(AD_y)
						.tickSize(0)
					)
		.select(".domain").remove();

  // Prep the tooltip bits, initial display is hidden
  var AD_tooltip = AD_svg.append("g")
    .attr("class", "asdf")
    .style("display", "none");

  AD_tooltip.append("rect")
    .attr("width", 40)
    .attr("height", 20)
    .attr("fill", "black")
    .attr("rx", "4")
    .attr("ry", "4")
    .style("opacity", 0.8);

  AD_tooltip.append("text")
    .attr("x", 20)
    .attr("dy", "1.1em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "white");
});
