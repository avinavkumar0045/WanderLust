
 maptilersdk.config.apiKey = mapToken; // from the show.ejs file 

const map = new maptilersdk.Map({ // copied from the maptiler sdk js
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.HYBRID,
    center : listing.geometry.coordinates, // starting posn [ long , lat]
    zoom : 10,
});

// console.log(coordinates);
// Add marker
const marker = new maptilersdk.Marker({color : 'red'})
    .setLngLat(listing.geometry.coordinates) // [longitude, latitude] // listing.gemetry.coordinate
    .setPopup(new maptilersdk.Popup({ offset: 25})
    .setHTML(`<h5>${listing.title}</h5><p>This is your listing location📍</p>`)) 
    .addTo(map);


// you can similarily add multiple marker , and just change the location coordinates , justcopy paste the above and name it as marker2
