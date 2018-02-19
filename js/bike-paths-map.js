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
    line-width: 2;
    line-color: ramp([rva_typ], ("#4BA27C", "#764189", "#4469A7", "#D54E75", "#f0f0f0"), ("Radwege", "Schutzstreifen", "Radfahrstreifen", "Bussonderfahrstreifen",  ), '=');
  }
`);

const bikePathsMapLayer = new carto.layer.Layer(bikePathsMapSource, bikePathsMapStyle, {
  featureOverColumns: ['rva_typ', 'stst_str', 'sorvt_typ']
});

bikePathsMapClient.addLayer(bikePathsMapLayer);
bikePathsMapClient.getLeafletLayer().addTo(bikePathsMap);


/* button actions */
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
bikePathsMapLayer.on('featureOver', featureEvent => {
  let rva_typ = '';
  let content = '';
  content += `<div class="wrapper">`;
  content += '<small>Street</small>';
  content += `<p>${featureEvent.data.stst_str}</p>`;

  content += '<small>Category</small>';
  switch (featureEvent.data.rva_typ) {
    case 'Radwege':
      rva_typ = 'Cycle Tracks/Paths';
      break;
    case 'Schutzstreifen':
      rva_typ = 'Advisory Bike Lanes';
      break;
    case 'Radfahrstreifen':
      rva_typ = 'Bike Lanes';
      break;
    case 'Bussonderfahrstreifen':
      rva_typ = 'Bus Lanes';
      break;
    default:
      rva_typ = 'unknown';
  }
  content += `<p>${rva_typ}</p>`;

  content += '<small>Type</small>';
  content += `<p>${featureEvent.data.sorvt_typ}</p>`;
  content += `</div>`;
  document.getElementById('content').innerHTML = content;
});

bikePathsMapLayer.on('featureOut', featureEvent => {
  document.getElementById('content').innerHTML = '';
});
