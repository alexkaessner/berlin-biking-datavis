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
	var stepHeight = Math.floor(window.innerHeight * 1);
	step.style('height', stepHeight + 'px');

	// 2. update width/height of graphic element
	var bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('width', bodyWidth + 'px')
		.style('height', (window.innerHeight-28) + 'px'); // substracting the height of the navbar

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
		securityMap.flyTo([52.516369, 13.380871], 12);

		securityMapClient.removeLayer(securityMapLayer2);
	}
  if (response.index == 1) {
		securityMap.flyTo([52.516369, 13.380871], 12);

		securityMapClient.addLayer(securityMapLayer2);
	}
  if (response.index == 2) {
		securityMap.flyTo([52.549479, 13.413720], 16);
	}
  if (response.index == 3) {
		securityMap.flyTo([52.516369, 13.380871], 16);
	}
  if (response.index == 4) {
		securityMap.flyTo([52.528292, 13.409065], 16);
	}
	if (response.index == 5) {
		securityMap.flyTo([52.487090, 13.424768], 16);
	}
	if (response.index == 6) {
		securityMap.flyTo([52.509486, 13.376373], 16);
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
	center: [52.516369, 13.380871],
	zoom: 12,
	scrollWheelZoom: false,
	zoomControl: false
});

L.control.zoom({
	position: 'bottomright'
}).addTo(securityMap);

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Sources: <a href="https://daten.berlin.de/datensaetze/radverkehrsanlagen-wms">Berlin Open Data</a> (bike paths), <a href="https://stefanwehrmeyer.carto.com/viz/5eae5a82-366a-11e7-a26a-0e233c30368f/public_map">Stefan Wehrmeyer</a> (bike accident spots), <a href="https://web.archive.org/web/20150926032822/https://radsicherheit.berlin.de/">Online-Dialog Berlin</a> (subjective hot spots)'
}).addTo(securityMap);

const securityMapClient = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});

const securityMapSource1 = new carto.source.SQL(`
  SELECT *
    FROM berlin_bike_accident_spots_2016_1
`);

const securityMapSource2 = new carto.source.SQL(`
  SELECT *
    FROM radsicherheitsdialog_top_spots
`);

const securityMapStyle0 = new carto.style.CartoCSS(`
	#layer {
	  line-width: 1.5;
	  line-color: #78D19C;
	  line-opacity: 0.4;
	}
`);

const securityMapStyle1 = new carto.style.CartoCSS(`
	#layer {
	  marker-width: ramp([count], range(6, 45), equal(7));
	  marker-fill: #ff0000;
	  marker-fill-opacity: 0.6;
	  marker-allow-overlap: true;
	  marker-line-width: 0;
	  marker-line-color: #ff0000;
	  marker-line-opacity: 1;
	}
`);

const securityMapStyle2 = new carto.style.CartoCSS(`
	#layer {
	  marker-width: 45;
	  marker-fill: #1463d9;
	  marker-fill-opacity: 0.25;
	  marker-allow-overlap: true;
	  marker-line-width: 1;
	  marker-line-color: #1463d9;
	  marker-line-opacity: 1;
	}
	#layer::labels {
	  text-name: [name];
	  text-face-name: 'DejaVu Sans Book';
	  text-size: 10;
	  text-fill: #FFFFFF;
	  text-label-position-tolerance: 0;
	  text-halo-radius: 1;
	  text-halo-fill: #6F808D;
	  text-dy: -10;
	  text-allow-overlap: true;
	  text-placement: point;
	  text-placement-type: dummy;
	}
`);

const securityMapLayer0 = new carto.layer.Layer(bikePathsMapSource, securityMapStyle0, {
  featureOverColumns: ['rva_typ', 'stst_str']
});

const securityMapLayer1 = new carto.layer.Layer(securityMapSource1, securityMapStyle1, {
  featureOverColumns: ['count']
});

const securityMapLayer2 = new carto.layer.Layer(securityMapSource2, securityMapStyle2);

// load maps at last!
securityMapClient.addLayer(securityMapLayer0);
securityMapClient.addLayer(securityMapLayer1);
//securityMapClient.addLayer(securityMapLayer2);
securityMapClient.getLeafletLayer().addTo(securityMap);

/* pop-up */
securityMapLayer1.on('featureOver', featureEvent => {
  let content2 = '';
  content2 += `<div class="wrapper">`;
  content2 += `<small>Accidents in 2016</small>`;
  content2 += `<p>${featureEvent.data.count}</p>`;
  content2 += `</div>`;
  document.getElementById('bike-security-pop-up').innerHTML = content2;
});

securityMapLayer1.on('featureOut', featureEvent => {
  document.getElementById('bike-security-pop-up').innerHTML = '';
});
