// set the dimensions and margins of the graph
var AD_margin = {top: 0, right: 10, bottom: 20, left: 57},
    AD_width = 670 - AD_margin.left - AD_margin.right,
    AD_height = 300 - AD_margin.top - AD_margin.bottom;

var AD_y = d3.scaleBand()
		.rangeRound([AD_height, 0])
		.paddingInner(0.05)

var AD_y0 = d3.scaleBand()
    .padding(0.05)

var AD_x = d3.scaleLinear()
		.rangeRound([0, AD_width]);

var AD_z = d3.scaleOrdinal()
		.range(["#98abc5", "#6b486b", "#ff8c00", "#ffffff"]);

// basic SVG setup
var AD_svg = d3.select("#accidentdamage-chart").append("svg")
		.attr("width", AD_width + AD_margin.left + AD_margin.right)
		.attr("height", AD_height + AD_margin.top + AD_margin.bottom)
	.append("g")
		.attr("transform", "translate(" + AD_margin.left + "," + AD_margin.top + ")");

// get the data
d3.csv("../data/accidentdamage-chart.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

	var AD_keys = data.columns.slice(1);

	AD_y.domain(data.map(function(d) { return d.type }))
  AD_y0.domain(AD_keys).rangeRound([AD_y.bandwidth(), 0])
	AD_x.domain([0, d3.max(data, function(d) { return d3.max(AD_keys, function(key) { return d[key]; }); })]).nice();
	AD_z.domain(AD_keys);

	AD_svg.append("g")
    .attr("class", "bars")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0, " + AD_y(d.type) + ")"; })
    .selectAll("rect")
    .data(function(d) { return AD_keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("y", function(d) { return AD_y0(d.key); })
      .attr("x", "0")
      .attr("height", AD_y0.bandwidth())
      .attr("width", function(d) { return AD_x(d.value); })
      .attr("fill", function(d) { return AD_z(d.key); });
      /*.on("mouseover", function(d, i, node) {
        AD_tooltip.attr("class", "visible");
        d3.select(".y-axis").selectAll("g").select("text").filter(function (d, i2) { return i2 === i; }).attr("font-weight", "bold");
      })
      .on("mouseout", function(d, i, node) {
        AD_tooltip.attr("class", "hidden");
        d3.select(".y-axis").selectAll("g").select("text").attr("font-weight", "normal");
      })
      .on("mousemove", function(d, i, node) {
        var xPosition = d3.mouse(this)[0] + 70;
        var yPosition = d3.mouse(this)[1];
        AD_tooltip.style("left", xPosition + "px");
        AD_tooltip.style("top", yPosition + "px");
        AD_tooltip.html("<h5>" + data[i].type + "</h5>dead: <b>" + data[i].dead + "</b><br/>" + "seriously injured: <b>" + data[i].seriously_injured + "</b><br/>" + "slightly injured: <b>" + data[i].slightly_injured + "</b><br/>" + "total: <b>" + (data[i].total - data[i].difference_to_highest_total) + "</b>");
      });*/

  // X-Achsis
	AD_svg.append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(AD_x)
						.ticks(null, "s")
						.tickSize(AD_height)
					)
			.select(".domain").remove();
	AD_svg.selectAll(".tick").attr("opacity", "0.5");
	AD_svg.selectAll(".tick:not(:first-of-type) line").attr("stroke-dasharray", "2,2");

  // Y-Achsis
  AD_svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(AD_y)
						.tickSize(0)
					)
		  .select(".domain").remove();

  // Prep the tooltip bits, initial display is hidden
  // var AD_tooltip = d3.select("#accidentdamage-tooltip");
});
