'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const PredictionMaps = ({ crimeData }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [geofenceBoundary, setGeofenceBoundary] = useState(null); // Store the boundary
  const [userMarker, setUserMarker] = useState(null);
  const [userParams, setUserParams] = useState({
    time_of_day: 2,
    has_vehicle: 1,
    num_people_accompanying: 0,
  });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'drawing'],  // Added 'drawing' library
      });

      const google = await loader.load();
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 10.028485, lng: 76.310016 }, // Centered on Cochin University area
        zoom: 8,
      });

      setMap(mapInstance);

      // Initialize user marker
      const userMarkerInstance = new google.maps.Marker({
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });
      setUserMarker(userMarkerInstance);

      // Add markers for crime data
      crimeData.features.forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: `Crime ID: ${feature.properties.id}`,
        });
      });

      // Initialize the Drawing Manager
      const drawingManagerInstance = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['rectangle'],
        },
        rectangleOptions: {
          editable: true,
          draggable: true,
        },
      });

      drawingManagerInstance.setMap(mapInstance);
      setDrawingManager(drawingManagerInstance);

      // Capture the drawn rectangle and set the geofence boundary
      google.maps.event.addListener(drawingManagerInstance, 'overlaycomplete', (event) => {
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          const rectangle = event.overlay;
          const bounds = rectangle.getBounds();

          // Store the geofence boundary
          setGeofenceBoundary(bounds);

          // Optional: Alert the user that the boundary is set
          alert('Geofence boundary set!');
        }
      });
    };

    // Initialize the map and drawing manager
    initMap();
  }, [crimeData]);

  // Get the user's location and check if it's inside the geofence
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Update the user marker position
        const userLatLng = new google.maps.LatLng(userLat, userLng);
        userMarker.setPosition(userLatLng);

        // Check if user is within the geofence boundary
        if (geofenceBoundary && !geofenceBoundary.contains(userLatLng)) {
          alert('You are outside your home locality!');
        }
      }, (error) => {
        console.error('Error getting user location:', error);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Call this function once the map is loaded and geofence is set
  useEffect(() => {
    if (map && geofenceBoundary) {
      getUserLocation();
    }
  }, [map, geofenceBoundary]);

  const calculateSafeRoute = async () => {
    // Your existing calculateSafeRoute code remains unchanged
  };

  const handleUserParamChange = (e) => {
    const { name, value } = e.target;
    setUserParams(prevParams => ({
      ...prevParams,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input id="origin" type="text" placeholder="Origin" />
        <input id="destination" type="text" placeholder="Destination" />
        <button onClick={calculateSafeRoute}>Calculate Safe Route</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Time of day:
          <select name="time_of_day" value={userParams.time_of_day} onChange={handleUserParamChange}>
            <option value={1}>Day</option>
            <option value={2}>Night</option>
          </select>
        </label>
        <label>
          Has vehicle:
          <select name="has_vehicle" value={userParams.has_vehicle} onChange={handleUserParamChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>
        <label>
          Number of people accompanying:
          <input
            type="number"
            name="num_people_accompanying"
            value={userParams.num_people_accompanying}
            onChange={handleUserParamChange}
            min="0"
          />
        </label>
      </div>
      <div ref={mapRef} style={{ height: '630px', width: '100%' }} />
    </div>
  );
};

export default PredictionMaps;
