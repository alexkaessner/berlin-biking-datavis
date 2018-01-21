// CARTO MAP LOADING

var map = L.map('bike-paths-map').setView([52.520008, 13.404954], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const client = new carto.Client({
  apiKey: config.CARTO_API_KEY,
  username: config.CARTO_USERNAME
});

const source = new carto.source.SQL(`
  SELECT *
    FROM berlin_radverkehrsanlagen_2
`);


const style = new carto.style.CartoCSS(`
  #layer {
    line-width: 2.5;
    line-color: ramp([rva_typ], ("#ef255f", "#1d6996", "#38a6a5", "#ffd460", "#f0f0f0"), ("Radwege", "Schutzstreifen", "Radfahrstreifen", "Bussonderfahrstreifen",  ), '=');
  }
`);

//const layer = new carto.layer.Layer(source, style);

const layer = new carto.layer.Layer(source, style, {
  featureOverColumns: ['rva_typ', 'stst_str']
});

/*
const populatedPlacesLayer = new carto.layer.Layer(populatedPlacesSource, populatedPlacesStyle, {
featureOverColumns: ['name', 'pop_max', 'pop_min']
});
*/

client.addLayer(layer);
client.getLeafletLayer().addTo(map);

function setAll() {
  source.setQuery(`
      SELECT * FROM berlin_radverkehrsanlagen_2
  `);
}

function setRadwege() {
  source.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Radwege\'
  `);
}

function setSchutzstreifen() {
  source.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Schutzstreifen\'
  `);
}

function setRadfahrstreifen() {
  source.setQuery(`
    SELECT *
      FROM berlin_radverkehrsanlagen_2
      WHERE rva_typ = \'Radfahrstreifen\'
  `);
}

function setBussonderfahrstreifen() {
  source.setQuery(`
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
    popup.openOn(map);
  }
}

function closePopup(featureEvent) {
  popup.removeFrom(map);
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


layer.on('featureOver', featureEvent => {
  let content = '';
  content += `<div class="wrapper">`;
  content += `<h4>${featureEvent.data.rva_typ.toUpperCase()}</h4>`;
  content += `<p>${featureEvent.data.stst_str} <small></small></p>`;
  content += `</div>`;
  document.getElementById('content').innerHTML = content;
});

layer.on('featureOut', featureEvent => {
  document.getElementById('content').innerHTML = '';
});
