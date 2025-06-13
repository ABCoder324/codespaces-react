import React, { useRef, useCallback } from 'react';
import './App.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const TILE_SIZE = 256;

function convert(latLng, zoom) {

  const scale = 1 << zoom;

  const worldCoordinate = project(latLng);

  const tileCoordinate = new google.maps.Point(
    Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
  );

  return 
    tileCoordinate;
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

function App() {
  const mapContainerStyle = {
    width: '1500px',
    height: '1100px',
    margin: '20px auto'
  };
  const center = {
    lat: 37.7749, // Example: San Francisco
    lng: -122.4194
  };

  return (
    <div className="App" >
      <header className="App-header">
        {/* Google Map */}
        <LoadScript googleMapsApiKey="AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8"> 
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            mapId="8ea0b74f8a301c1beb1759db"
            onLoad={useCallback(map => {
              console.log('Map loaded:', map);
              const markerOptions = { 
                map: map,
                position: { lat: 37.8058, lng: -122.4228 }, 
                title: "Ghiradelli Square" 
            };
            var tile = convert({ lat: 37.8058, lng: -122.4228 }, 12)
            alert(tile)
            var settings = {
  "url": "https://airquality.googleapis.com/v1/currentConditions:lookup?key=AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({
    "location": {
      "latitude": 37.419734,
      "longitude": -122.0827784
    }
  }),
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
            const marker = new google.maps.Marker(markerOptions);
                } , [])} 

          >
          </GoogleMap>
        </LoadScript>
      </header>
    </div>
  );

}

export default App;