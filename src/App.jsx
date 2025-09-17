import React, { useRef, useState } from 'react';
import './App.css';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Legend } from './legend';
import MoonLoader from "react-spinners/MoonLoader";

function App() {
  const [spinning, setSpinning] = useState(false);
  const spinningRef = useRef(spinning); // 1. Create a ref to hold the spinning state
  const mapRef = useRef(null);

  // 2. Update the ref every time the state changes
  React.useEffect(() => {
    spinningRef.current = spinning;
  }, [spinning]);

  // Use a ref for heatmap to persist across renders
  const heatmapRef = useRef(null);

  async function creatingGrid(map) {
    // 3. Use the ref to check the current spinning state
    if (spinningRef.current) {
      console.log('Grid creation already in progress.');
      return;
    }

    console.log('creating grid');
    setSpinning(true);
    
    // Check if the map is initialized
    if (!map) {
      console.error('Map not initialized');
      setSpinning(false);
      return;
    }

    const bounds = map.getBounds();
    const south = bounds.getSouthWest().lat();
    const west = bounds.getSouthWest().lng();
    const north = bounds.getNorthEast().lat();
    const east = bounds.getNorthEast().lng();
    const zoom = map.getZoom();
    localStorage.setItem('west', west);
    localStorage.setItem('south', south);
    localStorage.setItem('north', north);
    localStorage.setItem('east', east);
    localStorage.setItem('zoom', zoom);

    const latLngArray = creatingArray(south, west, north, east);
    console.log(latLngArray.length);

    // Using Promise.all for parallel fetching
    const fetchPromises = latLngArray.map(latLng => fetchAirQuality(latLng.lat, latLng.lng));
    const airQualityArray = await Promise.all(fetchPromises);

    const heatMapArray = latLngArray.map((latLng, index) => {
      const airQuality = airQualityArray[index];
      const weight = (airQuality > 0 && airQuality < 100) ? airQuality / 100 : 0.01;
      return { location: new google.maps.LatLng(latLng.lat, latLng.lng), weight: weight };
    });

    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }
    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
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
    heatmapRef.current.setMap(map);
    setSpinning(false);
  }

  function creatingArray(south, west, north, east) {
    const size = 5;
    const latLngArray = [];
    const latStep = (north - south) / size;
    const lngStep = (east - west) / size;
    for (let i = 0; i <= size; i++) {
      for (let j = 0; j <= size; j++) {
        const lat = south + (i * latStep);
        const lng = west + (j * lngStep);
        latLngArray.push({ lat, lng });
      }
    }
    return latLngArray;
  }

  async function fetchAirQuality(lat, lng) {
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

    try {
      const response = await fetch("https://airquality.googleapis.com/v1/currentConditions:lookup?key=YOUR-API-KEY", requestOptions);
      if (!response.ok) {
        if (response.status === 400) {
          console.error('API Error: Bad request');
          return 0;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      return json?.indexes?.[0]?.aqi || 0;
    } catch (error) {
      console.error('Fetch error:', error);
      return 0;
    }
  }

  let initialBounds = null;
  if (localStorage.getItem('west')) {
    const west = Number(localStorage.getItem('west'));
    const south = Number(localStorage.getItem('south'));
    const north = Number(localStorage.getItem('north'));
    const east = Number(localStorage.getItem('east'));
    initialBounds = { north, south, east, west };
  }

  const center = { lat: 37.7749, lng: -122.4194 };

  return (
    <div style={{ position: 'relative' }} className="App">
      <header className="App-header">
        <LoadScript googleMapsApiKey="[YOUR-API-KEY]" libraries={['visualization']}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', aspectRatio: '1/1', maxWidth: '800px', maxHeight: '800px' }}
            mapId="8ea0b74f8a301c1beb1759db"
            onLoad={map => {
              mapRef.current = map;
              if (initialBounds) {
                map.fitBounds(initialBounds);
                map.setZoom(15);
              } else {
                map.setCenter(center);
                map.setZoom(12);
              }
              google.maps.event.addListener(map, 'idle', () => { creatingGrid(map); });
            }}
          />
        </LoadScript>
      </header>
      {spinning && (
        <MoonLoader
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          color="#000000ff"
          loading={spinning}
          speedMultiplier={1}
        />
      )}
      <Legend />
    </div>
  );
}

export default App;