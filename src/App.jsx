import './App.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function App() {
  const mapContainerStyle = {
    width: '400px',
    height: '300px',
    margin: '20px auto'
  };
  const center = {
    lat: 37.7749, // Example: San Francisco
    lng: -122.4194
  };

  // Ghirardelli Square coordinates
  const ghirardelliSquare = {
    lat: 37.8058,
    lng: -122.4228
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <p>
          GitHub Codespaces <span className="heart">♥️</span> React
        </p>
        <p className="small">
          Edit <code>src/App.jsx</code> and save to reload.
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
        {/* Google Map */}
        <LoadScript googleMapsApiKey="">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          >
            <Marker position={ghirardelliSquare} />
          </GoogleMap>
        </LoadScript>
      </header>
    </div>
  );
}

export default App;
