import './App.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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

  // Ghirardelli Square coordinates
  const ghirardelliSquare = {
    lat: 37.8058,
    lng: -122.4228
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Google Map */}
        <LoadScript googleMapsApiKey="AIzaSyCW9BtPULGTFUJMFDX2qioN1R1baZT4CT8">
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
