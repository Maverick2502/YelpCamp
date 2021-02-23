    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [70.8503354718028, 38.63103862957675],
        zoom: 4
    });


new mapboxgl.Marker()
    .setLngLat([70.8503354718028, 38.63103862957675])
    .addTo(map);