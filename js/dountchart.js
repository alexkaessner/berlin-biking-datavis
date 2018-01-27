var data = [
    {
        "str_lab": "A",
        "num": 100
    },
    {
        "str_lab": "B",
        "num": 44
    },
    {
        "str_lab": "C",
        "num": 215
    },
    {
        "str_lab": "D",
        "num": 385
    }
];
var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;
var divNode = d3.select("body").node();
var outerRadius = height / 2 - 10;

var color = d3.scale.ordinal()
    .range(["red","#53856D","#FF7043", ""]);

var arc = d3.svg.arc()
    .padRadius(outerRadius)
    .innerRadius(radius * 0.5);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var pie = d3.layout.pie()
    .sort(null)
    .padAngle(0.03)
    .value(function(d) { return d.num; });

d3.select("#piechart").append("div")
    .attr("id","mainPie")
    .attr("class","pieBox");

var svg = d3.select("#mainPie").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var defs = svg.append("defs");
var filter = defs.append("filter")
                .attr("id", "drop-shadow")
               .attr("height","130%");

filter.append("feGaussianBlur")
        .attr("in","SourceAlpha")
        .attr("stdDeviation", 0)
        .attr("result", "blur");

filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 0)
    .attr("dy", 0)
    .attr("result", "offsetBlur");
    var feMerge = filter.append("feMerge");



feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");


//Number 4
var centerSvg = svg.append('circle')
  .attr('fill','#42A5F5')
  .attr("class","centerCircle")
  .style("opacity", .5)
  .attr('r','62');

// Define the div for the tooltip
var tooltipCenter = d3.selectAll("#centerTooltip").append("span")
    .style("opacity", 0);

var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .each(function(d) { d.outerRadius = outerRadius - 10; });

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.num); })
      .each(function(d) { d.outerRadius = outerRadius - 10; })
      .on("mousemove", function(d) {
          d3.select(this)
              //.transition()
              // .duration(200)
              // .attr("d", arcOver);


              .style("filter", "url(#drop-shadow)");
          d3.select(this)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform',function(d){
              var dist = 1;
              d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
              var x = Math.sin(d.midAngle) * dist;
              var y = Math.cos(d.midAngle) * dist;
              return 'translate(' + x + ',' + y + ')';


            });
            var mousePos = d3.mouse(divNode);

            d3.select("#mainTooltip")
              .style("left", mousePos[0] - 40 + "px")
              .style("top", mousePos[1] - 70 + "px")
              .select("#value")
              .attr("text-anchor", "middle")
              .html(d.data.str_lab + "<br />" + d.data.num);

          d3.select("#mainTooltip").classed("hidden", false);
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });

            tooltipCenter.transition()
                .duration(0)
                .style("opacity", .9);
            tooltipCenter.html(d.data.str_lab + "<br />" + d.data.num);
        })

      .on("mouseout", function(d){
          d3.select(this)
              .attr("stroke","none")
              .style("filter","none");
          d3.select(this)
            .transition()
            .duration(500)
            .ease('bounce')
            .attr('transform','translate(0,0)');

          d3.select("#mainTooltip").classed("hidden", true);
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius  - 10);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })

      .on("mousemove", function() {
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius  - 10);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })
