import React, { useRef, useCallback } from 'react';
import './App.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useMap } from '@vis.gl/react-google-maps';

function creatingGrid(){
  console.log('creating grid');
  var bounds = myMap.getBounds();
  var south = bounds.getSouthWest().lat();
  var west = bounds.getSouthWest().lng();
  var north = bounds.getNorthEast().lat();
  var east = bounds.getNorthEast().lng();
  console.log(south)
}

function App() {
  const mapRef = useMap ();
  const mapContainerStyle = {
    width: '1000px',
    height: '1000px',
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
              window.myMap = map;
              google.maps.event.addListenerOnce(map, 'idle', function(){creatingGrid()})
              const markerOptions = { 
                map: map,
                position: { lat: 37.8058, lng: -122.4228 }, 
                title: "Ghiradelli Square" 
            };
            var tile = convert({ lat: 37.8058, lng: -122.4228 }, 12)
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