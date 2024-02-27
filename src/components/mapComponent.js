import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './mapComponent.css'


const customIconNetwork = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'), 
  iconSize: [12, 20], // Size of the icon
  iconAnchor: [6, 20],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'), 
  shadowSize: [20, 20],
});

const customIconStation = new L.Icon({
  iconUrl: require('leaflet/dist/images/layers.png'),
  iconRetinaUrl: require('leaflet/dist/images/layers-2x.png'), 
  iconSize: [12, 20], // Size of the icon
  iconAnchor: [6, 20],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [20, 20],
});


const MapComponent = ({ data }) => {
  const initialPosition = [0, 0];
  const initialZoomLevel = 2;
  const [position, setPosition] = useState(initialPosition);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [stationData, setStationData] = useState(null);

  function UpdateMapView() {
    const map = useMap();
    useEffect(() => {
      map.setView(position, zoomLevel);
    });
    return null;
  }

  function backButtonClick() {
    setSelectedNetwork(null);
    setPosition(initialPosition);
    setZoomLevel(initialZoomLevel);
  }

  const fetchStationData = async (networkId) => {
    try {
      const response = await fetch(`http://api.citybik.es/v2/networks/${networkId}`);
      const networkData = await response.json();
      setStationData(networkData.network.stations); // Adjust according to actual API response structure
      setSelectedNetwork(networkId);
      setPosition([networkData.network.location.latitude, networkData.network.location.longitude]);
      setZoomLevel(12);
    } catch (error) {
      console.error("Failed to fetch station data:", error);
    }
  };


  return (
    <div>
      <div class="app-container">
        <h1>Bike Share App</h1>
        <div class="content">
          <div class="info-section">
            <div class="info-item">
              <div class="navigation">
                <button class="back-button" onClick={() => backButtonClick()}>Back to Networks</button>
              </div>
            </div>
            <div class="info-item">
              <img src={require('leaflet/dist/images/marker-icon.png')} alt="Network" />
              <span>Network</span>
            </div>
            <div class="info-item">
              <img src={require('leaflet/dist/images/layers.png')} alt="Station" />
              <span>Station</span>
            </div>
          </div>
        </div>
      </div>

      <div class="map-container" style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
        <MapContainer
          center={position}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <UpdateMapView />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            selectedNetwork === null
              ? data.networks.map((network) => (
                <Marker
                  key={network.id}
                  position={[network.location.latitude, network.location.longitude]}
                  icon={customIconNetwork}
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                    mouseout: (e) => {
                      e.target.closePopup();
                    },
                    click: () => fetchStationData(network.id),
                  }}
                >
                  <Popup>
                    <div>
                      <h2>{network.name}</h2>
                      <p>City: {network.location.city}</p>
                      <p>Country: {network.location.country}</p>
                      <p>Name: {network.name}</p>
                    </div>
                  </Popup>
                </Marker>
              )) : stationData.map((station) => (
                /* Station markers */
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={customIconStation}
                >
                  <Popup>
                    <div>
                      <p>Name: {station.name}</p>
                      <p>Empty Slots: {station.empty_slots}</p>
                      <p>Free Bikes: {station.free_bikes}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
        </MapContainer>

      </div>
    </div>
  );
};

export default MapComponent;
