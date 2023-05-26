/* eslint-disable */

export function displayMap(locationsArray) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGhlYWltaGVybyIsImEiOiJjbGkxYzdqdWowMTdzM3VwbW0wNWhsbWoxIn0.MU63tR9TXa5GDSTR0jS0yw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/theaimhero/cli23mu1400kk01pn258lcdtw',
    interactive: false,
  });

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
}
