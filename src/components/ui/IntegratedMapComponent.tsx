'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const IntegratedMapComponent = ({ crimeData }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);
  const [geofenceBoundary, setGeofenceBoundary] = useState(null);
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
        libraries: ['places', 'drawing', 'visualization'],
      });

      const google = await loader.load();
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 10.028485, lng: 76.310016 }, // Centered on Cochin University area
        zoom: 8,
      });

      setMap(mapInstance);
      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(new google.maps.DirectionsRenderer({ map: mapInstance }));

      // Initialize heatmap
      const heatmapData = crimeData.features.map(feature => ({
        location: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
        weight: feature.properties.CrimeRate,
      }));

      const heatmapLayer = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstance,
      });
      setHeatmap(heatmapLayer);

      // Initialize markers
      const newMarkers = crimeData.features.map(feature => {
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
          map: mapInstance,
          title: `Crime ID: ${feature.properties.id}`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>Crime ID: ${feature.properties.id}</h3>
              <p>Magnitude: ${feature.properties.mag}</p>
              <p>Crime Types: ${feature.properties.crime.join(', ')}</p>
              <p>Police Station Proximity: ${feature.properties.proximity_police_station} km</p>
              <p>Lighting at Night: ${feature.properties.lighting_at_Night}</p>
              <p>Traffic Density: ${feature.properties.traffic_density}</p>
              <p>Reported Incidents: ${feature.properties.reported_incidents}</p>
              <p>Public Transport Proximity: ${feature.properties.proximity_public_transport} km</p>
              <p>Nearby Shops: ${feature.properties.shops_nearby}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);

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

      // Initialize Drawing Manager
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
          setGeofenceBoundary(bounds);
          alert('Geofence boundary set!');
        }
      });

      // Initialize autocomplete for origin and destination inputs
      const originInput = document.getElementById('origin');
      const destinationInput = document.getElementById('destination');
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
      originAutocomplete.bindTo('bounds', mapInstance);
      destinationAutocomplete.bindTo('bounds', mapInstance);

      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry) {
          mapInstance.panTo(place.geometry.location);
          userMarkerInstance.setPosition(place.geometry.location);
        }
      });
    };

    initMap();
  }, [crimeData]);

  useEffect(() => {
    if (map && geofenceBoundary) {
      getUserLocation();
    }
  }, [map, geofenceBoundary]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userLatLng = new google.maps.LatLng(userLat, userLng);
        userMarker.setPosition(userLatLng);

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

  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer) return;

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`Error: ${status}`);
        }
      }
    );
  };

  const toggleHeatmap = () => {
    if (heatmap) {
      heatmap.setMap(heatmap.getMap() ? null : map);
    }
  };

  const toggleMarkers = () => {
    const newVisibility = markers[0].getVisible() ? false : true;
    markers.forEach(marker => marker.setVisible(newVisibility));
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
        <input id="origin" type="text" placeholder="Origin" className="border border-gray-300 rounded px-3 py-2 m-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        git init />
        <input id="destination" type="text" placeholder="Destination" className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-4" onClick={calculateRoute}>Calculate Safe Route</button>
        <button onClick={toggleHeatmap}>Toggle Heatmap</button>
        <button onClick={toggleMarkers}>Toggle Markers</button>
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

export default IntegratedMapComponent;