var data = [
    {
        "str_lab": "Radwege",
        "num": 100,
        "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit."
    },
    {
        "str_lab": "Radfahrstreifen",
        "num": 44,
        "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit."
    },
    {
        "str_lab": "Schutzstreifen",
        "num": 215,
        "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit."
    },
    {
        "str_lab": "Bussonderfahrstreifen",
        "num": 385,
        "info": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit."
    }
];


var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;
var divNode = d3.select("body").node();
var outerRadius = height / 2 - 10;

var color = d3.scale.ordinal()
    .range(["#5FB47E","#3F678B","#F9E755", "#3E0A51"]);

var arc = d3.svg.arc()
    .padRadius(outerRadius)
    .innerRadius(radius * 0.5);


var pie = d3.layout.pie()
    .sort(null)
    .padAngle(0.0)
    .value(function(d) { return d.num; });

d3.select("#bikepath-types-chart").append("div")
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
              .html(d.data.info);

          d3.select("#mainTooltip").classed("hidden", false);
        d3.select(this).transition().duration(200).delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
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

      //Number 4
      var centerSvg = svg.append('circle')
        .attr('fill','#42A5F5')
        .attr('r','62');


              	svg.append('text')
                .attr("transform", "translate(0," + 20 + ")")
                .attr("text-anchor", "middle")

                .on("mouseover", function(){
           d3.select(this)
               .style("fill", "blue")
               style("fill", "url(#image)");
     });
                //.html(data.length);
