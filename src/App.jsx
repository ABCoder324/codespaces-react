import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import './App.css';

const containerStyle = {
  width: "400px",
  height: "400px"
};

const center = {
  lat: 37.4220656,
  lng: -122.0840897
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <p>
          GitHub Codespaces <span className="heart"></span> 
        </p>
        <p className="small">
          Edit <code></code> and save to reload.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
        <LoadScript googleMapsApiKey="AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
        </LoadScript>
      </header>
    </div>
  );
}

export default App;