/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { locations } = document.getElementById('map').dataset;
const locationsArray = JSON.parse(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidGhlYWltaGVybyIsImEiOiJjbGkxYzdqdWowMTdzM3VwbW0wNWhsbWoxIn0.MU63tR9TXa5GDSTR0jS0yw';
// mapboxgl.accessToken = tour.mapboxToken
// <iframe width='100%' height='400px' src="https://api.mapbox.com/styles/v1/theaimhero/cli23mu1400kk01pn258lcdtw.html?title=false&access_token=pk.eyJ1IjoidGhlYWltaGVybyIsImEiOiJjbGkxYm1jdG4xdnRlM2RudG1kNjh0aGxoIn0.nfPGAPFi-lpQCAt2ZhVTCA&zoomwheel=false#11/40.73/-74" title="Monochrome" style="border:none;"></iframe>
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/theaimhero/cli23mu1400kk01pn258lcdtw',
  // center: [-118.113491, 34.111745],
  // zoom: 13,
  interactive: false,
});

// const bounds = mapboxgl.LatLngBounds();
const bounds = new mapboxgl.LngLatBounds();

locationsArray.forEach(loc => {
  const el = document.createElement('div');
  el.className = 'marker';
  new mapboxgl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({ offset: 35 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: { top: 200, bottom: 150, left: 200, right: 200 },
});
