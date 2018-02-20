// CARTO MAP LOADING

var bikeRouteMap = L.map('bikeroute-map', {
  center: [52.520008, 13.404954],
  zoom: 12,
  scrollWheelZoom: false
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Source: <a href="https://www.berlin.de/senuvk/verkehr/mobil/fahrrad/radrouten/de/gps_tracks/index.shtml">Berlin Open Data - Berlin.de</a>'
}).addTo(bikeRouteMap);

const bikePathsMapClient = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});
