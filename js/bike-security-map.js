// SCROLLYTELLING

// using d3 for convenience
var container = d3.select('#bike-security-container');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('width', bodyWidth + 'px')
		.style('height', window.innerHeight + 'px');

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }

	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step
	if (response.index == 0) {
    // reset to initial position
		securityMap.flyTo([52.520008, 13.404954], 13);
	}
  if (response.index == 1) {
		securityMap.flyTo([52.549479, 13.413720], 16);
	}
  if (response.index == 2) {
		securityMap.flyTo([52.516369, 13.380871], 16);
	}
  if (response.index == 3) {
		securityMap.flyTo([52.528292, 13.409065], 16);
	}
}

function handleContainerEnter(response) {
	// response = { direction }

	// sticky the graphic (old school)
	graphic.classed('is-fixed', true);
	graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
	// response = { direction }

	// un-sticky the graphic, and pin to top/bottom of container
	graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
}

function init() {
	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		container: '#bike-security-container',
		graphic: '.scroll__graphic',
		text: '.scroll__text',
		step: '.scroll__text .step'
	})
		.onStepEnter(handleStepEnter)
		.onContainerEnter(handleContainerEnter)
		.onContainerExit(handleContainerExit);

	// setup resize event
	window.addEventListener('resize', handleResize);
}

// kick things off
init();

// -----------------------------------------------------------------------------

// CARTO MAP LOADING

var securityMap = L.map('bike-security-map', {
	center: [52.520008, 13.404954],
	zoom: 13,
	scrollWheelZoom: false,
	zoomControl: false
});

L.control.zoom({
	position: 'topright'
}).addTo(securityMap);

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(securityMap);

const securityMapClient = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});

const securityMapSource = new carto.source.SQL(`
  SELECT *
    FROM berlin_bike_accident_spots_2016_1
`);


const securityMapStyle = new carto.style.CartoCSS(`
	#layer {
	  marker-width: ramp([count], range(5, 20), quantiles(5));
	  marker-fill: #ff0900;
	  marker-fill-opacity: 1;
	  marker-allow-overlap: true;
	  marker-line-width: 0;
	  marker-line-color: #FFFFFF;
	  marker-line-opacity: 1;
	}
`);

const securityMapLayer = new carto.layer.Layer(securityMapSource, securityMapStyle, {
  featureOverColumns: ['count']
});

// load maps at last!
securityMapClient.addLayer(securityMapLayer);
securityMapClient.getLeafletLayer().addTo(securityMap);
