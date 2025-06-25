const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
});

fetch('https://script.google.com/macros/s/AKfycbxSdfk4onDJHn74FS1z8TaIjWFDLAmTSTOTRe6jFqM62KXfh3K_FcugGX2UnyrZkd5qBg/exec')
  .then(response => response.json())
  .then(data => {
    addMarkersToMap(data);
  })
  .catch(error => console.error('Error:', error));

function addMarkersToMap(data) {
  const vectorSource = new ol.source.Vector();

  data.forEach(location => {
    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);
    const name = location.name;
    const googleMapsLink = location.address;

    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
      name: name,
      googleMapsLink: googleMapsLink
    });

    vectorSource.addFeature(marker);
  });

  const markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function(feature) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scale: 1.5
        }),
        text: new ol.style.Text({
          text: feature.get('name'),
          offsetY: -25, 
          font: 'bold 20px Arial',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      });
    }
  });

  map.addLayer(markerVectorLayer);

  map.on('singleclick', function(evt) {
    map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      const googleMapsLink = feature.get('googleMapsLink');
      if (googleMapsLink) {
        window.open(googleMapsLink, '_blank');
      }
    });
  });
}

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([0, 0]),
    zoom: 0
  })
});

window.addEventListener('resize', function() {
  map.updateSize();
});
