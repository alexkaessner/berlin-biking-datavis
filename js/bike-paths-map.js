// CARTO MAP LOADING

var bikePathsMap = L.map('bike-paths-map', {
  center: [52.520008, 13.404954],
  zoom: 12,
  scrollWheelZoom: false
});

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(bikePathsMap);

const bikePathsMapClient = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});

const bikePathsMapSource = new carto.source.SQL(`
  SELECT *
    FROM berlin_radverkehrsanlagen_2
`);


const bikePathsMapStyle = new carto.style.CartoCSS(`
  #layer {
    line-width: 2.5;
    line-color: ramp([rva_typ], ("#3E0A51", "#3F678B", "#4B9064", "#FCD016", "#f0f0f0"), ("Radwege", "Schutzstreifen", "Radfahrstreifen", "Bussonderfahrstreifen",  ), '=');
  }
`);

//const layer = new carto.layer.Layer(source, style);

const bikePathsMapLayer = new carto.layer.Layer(bikePathsMapSource, bikePathsMapStyle, {
  featureOverColumns: ['rva_typ', 'stst_str']
});

/*
const populatedPlacesLayer = new carto.layer.Layer(populatedPlacesSource, populatedPlacesStyle, {
featureOverColumns: ['name', 'pop_max', 'pop_min']
});
*/

bikePathsMapClient.addLayer(bikePathsMapLayer);
bikePathsMapClient.getLeafletLayer().addTo(bikePathsMap);

function setAll() {
  bikePathsMapSource.setQuery(`
      SELECT * FROM berlin_radverkehrsanlagen_2
  `);
}

function setRadwege() {
  bikePathsMapSource.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Radwege\'
  `);
}

function setSchutzstreifen() {
  bikePathsMapSource.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Schutzstreifen\'
  `);
}

function setRadfahrstreifen() {
  bikePathsMapSource.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Radfahrstreifen\'
  `);
}

function setBussonderfahrstreifen() {
  bikePathsMapSource.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Bussonderfahrstreifen\'
  `);
}

/* pop-ups */
/* to create pop-up information windows and interact with your map */
const popup = L.popup({ closeButton: false });

function openPopup(featureEvent) {
  popup.setLatLng(featureEvent.latLng);
  if (!popup.isOpen()) {
    let content = '';
    content += `<div class="popup-wrapper">`;
    if (featureEvent.data.name) {
      content += `<h2>${featureEvent.data.name}</h2>`;
    }
    if (featureEvent.data.pop_max || featureEvent.data.pop_min) {
      content += `<ul>`;
      if (featureEvent.data.pop_max) {
        content += `<li><h3>Max:</h3> <h4>${featureEvent.data.pop_max}</h4></li>`;
      }
      if (featureEvent.data.pop_min) {
        content += `<li><h3>Min:</h3> <h4>${featureEvent.data.pop_min}<h4></li>`;
      }
      content += `</ul>`;
    }
    content += `</div>`;
    popup.setContent(content);
    popup.openOn(bikePathsMap);
  }
}

function closePopup(featureEvent) {
  popup.removeFrom(bikePathsMap);
}

function setPopupsClick() {
  populatedPlacesLayer.off('featureOver');
  populatedPlacesLayer.off('featureOut');
  populatedPlacesLayer.on('featureClicked', openPopup);
}

function setPopupsHover() {
  populatedPlacesLayer.off('featureClicked');
  populatedPlacesLayer.on('featureOver', openPopup);
  populatedPlacesLayer.on('featureOut', closePopup);
}


bikePathsMapLayer.on('featureOver', featureEvent => {
  let content = '';
  content += `<div class="wrapper">`;
  content += `<h4>${featureEvent.data.rva_typ.toUpperCase()}</h4>`;
  content += `<p>${featureEvent.data.stst_str} <small></small></p>`;
  content += `</div>`;
  document.getElementById('content').innerHTML = content;
});

bikePathsMapLayer.on('featureOut', featureEvent => {
  document.getElementById('content').innerHTML = '';
});
