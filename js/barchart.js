/*
var data = [
  {
    "Name": "Radwege",
    "totalp": 1
  },
  {
    "Name": "Schutzstreifen",
    "totalp": 2
  },
  {
    "Name": "Radfahrstreifen",
    "totalp": 3
  },
  {
    "Name": "Bussonderfahrstreifen",
    "totalp": 4
  }
]

var bardata = [];
for (key in data) {
    // bardata.push(data[key].totalp)
    bardata.push(
        { totalp: +data[key].totalp, name: data[key].Name }
        )
    bardata.sort( function compareNumbers(a,b) { return a.totalp - b.totalp } )
}

var margin = {top: 40, right:30 , bottom:40 , left:50}

var height = 310 - margin.top - margin.bottom,
width = 535 - margin.left - margin.right

var colors = d3.scale.category20()

var yScale = d3.scale.linear()
    .domain([0,d3.max(maxData(bardata))])
    .range([height,0])

var xScale = d3.scale.ordinal()
    .domain(d3.range(1, bardata.length + 1))
    .rangeBands([0, bardata.length + width], .1)

var tooltip = d3.select('body').append('div')
    .style('position','absolute')
    .style("padding", "0 10px")
    .style('opacity',0)
    .attr('class','tooltip')

function maxData(data){
    var obj = data
    var maxDataSet = []
    for(var i in obj) {
    maxDataSet.push( +obj[i].totalp );
    maxDataSet.sort( function compareNumbers(a,b) { return a - b } )
    }
    return maxDataSet
}

var myChart = d3.select('#barchart')
  .append('svg')
    .attr('width',width + margin.left + margin.right)
    .attr('height',height + margin.top + margin.bottom)
  .append('g')
    .attr('transform','translate('+ margin.left +', '+margin.top +')')
    .selectAll('rect').data(bardata)

var rect = myChart
  .enter().append('rect')
    .style('fill', function(d,i) { return colors(i); })
    .attr('width', xScale.rangeBand())
    .attr('x', function(d,i) { return xScale(i + 1);})
    .attr("height", 0)
    .attr('y', height)
    //MOUSEOVER EVENT TO DISPLAY TOOLTIP
    .on('mousemove', function(d) {
        var rect = this; console.log(this)
        debugger;
        tooltip.transition()
            .style('opacity', .9)
            .style("background", "lightsteelblue")
        tooltip.html( d.name + ": " + d.totalp )
            .style('left',(d3.event.pageX - 35) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px')
    })
    .on('mouseout', function(d) {
        tooltip.transition()
            .style('opacity', 0)
    })

myChart.transition()
    .attr('height', function(d) { return height - yScale(d.totalp)})
    .attr('y', function(d) { return yScale(d.totalp); })
    .delay( function(d,i) { return i * 20; })
    .duration(1500)
    .ease('elastic')

var vGuideScale = d3.scale.linear()
    .domain([0, d3.max(maxData(bardata))])
    .range([height, 0])

var vAxis = d3.svg.axis()
    .scale(vGuideScale)
    .orient('left')
    .ticks(10)

var vGuide = d3.select('svg').append('g')
vAxis(vGuide)
vGuide.attr('transform','translate('+ margin.left +','+ margin.top +')')
vGuide.selectAll('path')
    .style({fill:'none',stroke:"#000"})
vGuide.selectAll('line')
    .style({stroke:"#000"})

var hAxis = d3.svg.axis()
.scale(xScale)
.orient('bottom')

var hGuide = d3.select('svg').append('g')
hAxis(hGuide)
hGuide.attr('transform','translate('+ margin.left +','+ (height + margin.top) +')')
hGuide.selectAll('path')
    .style({fill:'none',stroke:"#000"})
hGuide.selectAll('line')
    .style({stroke:"#000"})

*/
