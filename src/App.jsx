import React, { useRef, useCallback, useState, useEffect} from 'react';
import './App.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useMap } from '@vis.gl/react-google-maps'; 
import { Legend } from './legend';
import MoonLoader from "react-spinners/MoonLoader";

function App() {
  const[spinning, setSpinning] = React.useState(false);
  const mapRef = useMap ();
  const mapContainerStyle = {
    width: '100%',
    aspectRatio: '1/1',
    maxWidth: '800px',
    MaxHeight: '800px'
  };

var heatmap = null;
async function creatingGrid(map){
  console.log('creating grid');
  setSpinning(true);
  const bounds = myMap.getBounds();
  const south = bounds.getSouthWest().lat();
  const west = bounds.getSouthWest().lng();
  const north = bounds.getNorthEast().lat();
  const east = bounds.getNorthEast().lng();
  const zoom = myMap.getZoom();
  localStorage.setItem('west', west);
  localStorage.setItem('south', south);
  localStorage.setItem('north', north);
  localStorage.setItem('east', east);
  localStorage.setItem('zoom', zoom);
  var latLngArray = creatingArray(south, west, north, east);
  console.log(latLngArray.length);
  var airQualityArray = [];
  for(var latLng of latLngArray){
    console.log(`Element at index: ${latLng.lng}`);
    var airQuality = await fetchAirQuality(latLng.lat, latLng.lng);
    airQualityArray.push(airQuality);
  };
  var heatMapArray = [];
  latLngArray.forEach(function(latLng, index) {
    var airQuality = airQualityArray[index];
    var weight = .01;
    if (airQuality>0 & 100>airQuality){
      weight = airQuality/100;
    }
    console.log(weight)
    var heatMapData = {location: new google.maps.LatLng(latLng.lat, latLng.lng), weight: weight};
    heatMapArray.push(heatMapData);
  });
  if(heatmap){
    heatmap.setMap(null)
  }
  heatmap = new google.maps.visualization.HeatmapLayer({
  data: heatMapArray,
  radius: 150,
  opacity: 0.65,
  maxIntensity: 3,
  dissipating: false,
  gradient: [
    'rgba(0,0,0,0)',
    'rgba(0, 255, 0, 0.7)',
    'rgba(145, 255, 0, 0.59)',
    'rgba(255,255,0,0.3)',
    'rgba(255, 166, 0, 0.6)',
    'rgba(218, 44, 0, 0.84)',
  ]
  });
  heatmap.setMap(map);
  setSpinning(false);
} 

function creatingArray(south, west, north, east){
  const size = 5;
  const latLngArray = [];
  var latStep = (north - south) / size;
  var lngStep = (east - west) / size;
   for (let i = 0;  i<= size ; i++)  {
      for (let j = 0 ; j <= size ; j++ ) { 
        var lat = south + (i * latStep);
        var lng  = west + (j* lngStep);
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

  let initialBounds = null;

   if (localStorage.getItem('west')){
   
    var west = Number(localStorage.getItem('west'))
    var south = Number(localStorage.getItem('south'))
    var north = Number(localStorage.getItem('north'))
    var east = Number(localStorage.getItem('east'))
  
    initialBounds = {
      north: north,
      south: south, 
      east: east,  
      west: west  
    };
  }

  const center = {
    lat: 37.7749, // Example: San Francisco
    lng: -122.4194
  };

  return (
    <div style={{position: 'relative'}} className="App" >
      <header className="App-header">
        {/* Google Map */}
        <LoadScript googleMapsApiKey="AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8" 
          libraries={['visualization']}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            mapId="8ea0b74f8a301c1beb1759db"
            onLoad={useCallback(map => {
              console.log('Map loaded:', map);
              window.myMap = map;
              if (initialBounds){
                map.fitBounds(initialBounds)
                map.setZoom(15)
              }
              else{
                map.setCenter(center)
                map.setZoom(12)
              }
              google.maps.event.addListener(map, 'idle', function(){;creatingGrid(map)})
                } , [])} 
          >
          </GoogleMap>
        </LoadScript>
      </header>
      {spinning &&(
      <MoonLoader style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
      color="#000000ff"
      loading={spinning}
      speedMultiplier={1}
      />
      )}
      <Legend></Legend>
    </div>
  );

}

export default App;