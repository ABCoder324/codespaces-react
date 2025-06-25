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
  var latLngArray = creatingArray(south, west, north, east);
  console.log(latLngArray.length);
  var airQualityArray = [];
  latLngArray.forEach(async function(latLng, index) {
    console.log(`Element at index ${index}: ${latLng.lat}`);
    console.log(`Element at index ${index}: ${latLng.lng}`);
    var airQuality = await fetchAirQuality(latLng.lat, latLng.lng);
    airQualityArray.push(airQuality);
});

}

function creatingArray(south, west, north, east){
  const size = 10;
  const latLngArray = [];
   for (let i = 0;  i< size ; i++)  {
      for (let j = 0 ; j < size ; j++ ) { 
        const lat = south + (north -  south) * (i / size - 1);
        const lng  = west + (east - west) * (j / size - 1);
        latLngArray.push({lat, lng});
      }
    }
    return latLngArray;
}

async function fetchAirQuality(lat, lng){
  const myHeaders = new Headers();
 myHeaders.append("Content-Type", "application/json");

 const raw = JSON.stringify({
  "location": {
    "latitude": lat,
    "longitude": lng
  }
 });

 const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
 };

 var response = await fetch("https://airquality.googleapis.com/v1/currentConditions:lookup?key=AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8", requestOptions);
 if (response.status == 400){
  return 0;
 }
 var json = await response.json();
 //console.log(json?.indexes[0].aqi);
 if (! json){
  return 0;
 }
 if (! json.indexes){
  return 0;
 }
 var aqi = json.indexes[0].aqi
 console.log(aqi)

 return aqi;
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