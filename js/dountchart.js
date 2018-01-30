var data = [
    {
        "str_lab": "Radwege",
        "num": 100,
        "info": "Bike paths are dedicated lanes seperated from the road. Usually bike paths are located on the sidewalk. They are either shared with pedestrians, seperated trough painted marks, structurally differentiated or seperated.",
        "image": 'graphics/bikepath-types/radweg.svg'
    },
    {
        "str_lab": "Radfahrstreifen",
        "num": 44,
        "info": "Bike lanes are on-road lanes marked with a solid line and a road sign. You have to use this lane as a bicyclist. Therefore all motorized traffic is excluded and not permitted to drive or park there.",
        "image": 'graphics/bikepath-types/radfahrstreifen.svg'
    },
    {
        "str_lab": "Schutzstreifen",
        "num": 215,
        "info": "The bike lane is on the street and divided with a dashed line. Cars and busses are permitted to drive on the lane. Parking vehicles is not allowed.",
        "image": 'graphics/bikepath-types/schutzstreifen.svg'
    },
    {
        "str_lab": "Bussonderfahrstreifen",
        "num": 10,
        "info": "Bus lanes are special lanes only for busses and taxis. You are allowed to use this lane when marked with a extra road sign. Bus lanes can either have dashed or solid lines.",
        "image": 'graphics/bikepath-types/bussonderstreifen.svg'
    }
];


var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2;
var divNode = d3.select("body").node();
var outerRadius = height / 2 - 9;

var color = d3.scaleOrdinal()
    .range(["#5FB47E","#3F678B","#F9E755", 'blue']);

var arc = d3.arc()
    .padRadius(outerRadius)
    .innerRadius(radius * 0.5);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var pie = d3.pie()
    .sort(null)
    .padAngle(0.0)
    .value(function(d) { return d.num; });

d3.select("#chart").append("div")
    .attr("id","mainPie")
    .attr("class","pieBox");

var svg = d3.select("#mainPie").append("svg")
    .attr("width", width)
    .attr("height", height);


var g = svg
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

var pattern = defs.append('pattern')
    .attr('id', 'image')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', width)
    .attr('height', height);

var imageRadius = radius * 0.45;
var image = pattern.append('image').attr('x', width / 2 - imageRadius).attr('y', height / 2 - imageRadius).attr('width', 1.95 * imageRadius)
    .attr('height', 1.95 * imageRadius);

// Define the div for the tooltip
var tooltipCenter = d3.selectAll("#centerTooltip").append("span")
    .style("opacity", 0);

var g = g.selectAll(".arc")
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
            .ease(d3.easeBounce)
            .attr('transform',function(d){
              var dist = 1;
              d.midAngle = ((d.endAngle - d.startAngle)/2) + d.startAngle;
              var x = Math.sin(d.midAngle) * dist;
              var y = Math.cos(d.midAngle) * dist;
              return 'translate(' + x + ',' + y + ')';


            });
            var mousePos = d3.mouse(divNode);

            d3.select("#mainTooltip")
              .style("left", mousePos[0] + 20 + "px")
              .style("top", mousePos[1] - 50 + "px")
              .select("#value")
              //.attr("text-anchor", "middle")
              .html("<h5>" + d.data.str_lab + "</h5>" + "<br />" + "<p>" + d.data.info + "</p>");

          d3.select("#mainTooltip").classed("hidden", false);
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });

            tooltipCenter.transition()
                .duration(0)
                .style("opacity", .9);
            //tooltipCenter.html(d.data.str_lab + "<br />" + d.data.num);
        })


        .on("mouseover", function(d) {
          d3.select('pattern image')
            .attr('xlink:href', d.data.image);
          svg.select('circle.image')
            .attr('fill', 'url(#image)')

        })

      .on("mouseout", function(d){
          d3.select(this)
              .attr("stroke","none")
              .style("filter","none");
          d3.select(this)
            .transition()
            .duration(500)
            .ease(d3.easeBounce)
            .attr('transform','translate(0,0)');

          d3.select("#mainTooltip").classed("hidden", true);
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius  - 10);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })

      .on("click", function() {
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })
      .on("dblclick", function() {
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius  - 10);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
      })


      //centerCircle
      var centerSvg = d3.select("#mainPie svg").append('circle')
        .attr('class', 'image')
        .attr('fill','white')
        .attr('r', imageRadius)
.attr('cx', width / 2).attr('cy', height / 2)
