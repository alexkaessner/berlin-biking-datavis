// CARTO MAP LOADING

var bikeRouteMap = L.map('bikeroute-map', {
  center: [52.520008, 13.404954],
  zoom: 10.5,
  scrollWheelZoom: false
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Source: <a href="https://www.berlin.de/senuvk/verkehr/mobil/fahrrad/radrouten/de/gps_tracks/index.shtml">Berlin Open Data - Berlin.de</a>'
}).addTo(bikeRouteMap);

const bikeRouteMapClient = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});

const bikeRouteMapSource = new carto.source.SQL(`
  SELECT *
    FROM fahrradroute_1_js
`);


const bikeRouteMapStyle = new carto.style.CartoCSS(`
  #layer {
    line-width: 2;
    line-color: ramp([name], (#5F4690, #1D6996, #38A6A5, #0F8554, #73AF48, #EDAD08, #E17C05, #CC503E, #94346E, #6F4070, #666666, #1758b9, #b98e17, #b917b9, #ff1a00, #00d1d1, #2d71bf), ("Europaradweg Ost", "Europaradweg West", "Gatow", "Hellersdorf", "Hohenschoenhausen", "1. Mauerweg", "2. Mauerweg", "3. Mauerweg", "Nordspange", "Ostring", "Wannsee", "Teltow", "Suedspange", "Spandau", "Reinickendorf" , "Radfernweg: Berlin-Usedom", "Radfernweg: Berlin-Kopenhagen"), "=");
  }
`);


const bikeRouteMapLayer = new carto.layer.Layer(bikeRouteMapSource, bikeRouteMapStyle, {
  featureOverColumns: ['name', 'the_geom']
});


bikeRouteMapClient.addLayer(bikeRouteMapLayer);
bikeRouteMapClient.getLeafletLayer().addTo(bikeRouteMap);

/* pop-ups */
/* to create pop-up information windows and interact with your map */
bikeRouteMapLayer.on('featureOver', featureEvent => {
  let name = '';
  let content = '';
  content += `<div class="wrapper">`;
  content += '<small>Name</small>';
  content += `<p>${featureEvent.data.name}</p>`;

  document.getElementById('bikeroute-map-pop-up').innerHTML = content;
});
