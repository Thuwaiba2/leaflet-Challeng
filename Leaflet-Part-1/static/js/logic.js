const allMonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
const allWeek = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const allDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const earthquakeUrl = allWeek;
  

function fetchData(url) {
    return d3.json(url);
  }

  function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      // console.log(feature.geometry.coordinates[2]);
      layer.bindPopup(
        `
        <h3>Place: ${feature.properties.place}</h3>
        <hr>
        <p>Time: ${new Date(feature.properties.time)}</p>
        <p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]}</p>
        `
      );
        //`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`
  }

  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, coordinates) {
      const geoMarkers = {
        radius: feature.properties.mag * 5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        // fillColor: getColor(feature.properties.mag),
        fillOpacity: 0.7,
        color: "black",
        stroke: true,
        weight: 0.5,
      };
      return L.circleMarker(coordinates, geoMarkers);
    },
  });

  createMap(earthquakes);
}

function getColor(depth) {
  if (depth < 10) return "#00FF00";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth < 90) return "orangered";
  else return "#FF0000";
}

function createMap(earthquakes) {
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    const baseMaps = {
      "Street Map": street,
      // "Topographic Map": topo,
      // "Grayscale Map": grayscale,
    };
  
    const overlayMaps = {
      Earthquakes: earthquakes,
    };

    const myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes],
      });
    
    //   L.control.layers(baseMaps, overlayMaps).addTo(myMap);
      createLegend(myMap);
    }
    
    
    function createLegend(myMap) {
      const legend = L.control({ position: "bottomright" });
    
      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        // const depthRanges = [-10, 0, 1, 2, 3, 4, 5];
        const depthRanges = [-10, 10, 30, 50, 70, 90];
    
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
        for (let i = 0; i < depthRanges.length; i++) {
        //  const start = i === 0 ? "< 0" : depthRanges[i];
        //  const end = depthRanges[i + 1];
    
        //  div.innerHTML +=
        //    '<i style="background:' +
        //    getColor(depthRanges[i]) +
        //    '"></i> ' +
        //    start +
        //    (end !== undefined ? "&ndash;" + end + "<br>" : "+");
        // }
        div.innerHTML +=
        '<i style="background:' +
        getColor(depthRanges[i] + 1) +
        '"></i> ' +
        depthRanges[i] +
        (depthRanges[i + 1] ? "&ndash;" + depthRanges[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);
}

// Fetch earthquake data and initiate the process
fetchData(earthquakeUrl)
  .then((data) => {
    createFeatures(data.features);
  })
  .catch((error) => {
    console.error("Error fetching earthquake data:", error);
  });


