var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });
  
//Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


//Def a link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Getting  GeoJSON data
d3.json(link).then(function(data) {

console.log(data)
//def function to get the radius size
function radiusSize(rad) {
  return  rad * 3;
}

//de function to get the color of the tickers
function markerColor(depthValue) {
    if (depthValue <11) return "#698300";
    else if (depthValue< 31) return "#98BE00";
    else if (depthValue < 51) return "#C0EA16";
    else if (depthValue <71) return "#E3B90F";
    else if (depthValue <91) return "#DF7400";
    else return "#783014";
}

//def the function to assign marker colors based on the depth and marker sizes based on the magnitude
function geojsonMarkerOptions(style) {return  {
  radius: radiusSize(style.properties.mag),
  fillColor:  markerColor(style.geometry.coordinates[2]),
  color: "white",
  weight: 1,
  opacity: 1,
  fillOpacity: 1
}
};

//plot a layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: geojsonMarkerOptions,

    onEachFeature: function(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.place + "</h2> <hr> <h3>" + "Magnitude: "+feature.properties.mag + "</h3> <h3>" + "Depth: "+feature.geometry.coordinates[2] + "</h3>");
    }

  }).addTo(myMap);

//adding a legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


legend.addTo(myMap);

});


