'use client';
import { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapComponent = ({ crimeData }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'visualization'],
      });

      const google = await loader.load();
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      setMap(mapInstance);
      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(new google.maps.DirectionsRenderer());

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

      // Initialize autocomplete for origin and destination inputs
      const originInput = document.getElementById('origin');
      const destinationInput = document.getElementById('destination');

      // const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      // originAutocomplete.bindTo('bounds', mapInstance);
      destinationAutocomplete.bindTo('bounds', mapInstance);

      originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry) {
          mapInstance.panTo(place.geometry.location);
          userMarkerInstance.setPosition(place.geometry.location);
        }
      });

      destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
          // Handle any additional logic for destination selection if needed
        }
      });
    };

    initMap();
  }, [crimeData]);

  useEffect(() => {
    if (map && directionsRenderer) {
      directionsRenderer.setMap(map);
    }
  }, [map, directionsRenderer]);

  useEffect(() => {
    if (map && userMarker) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          userMarker.setPosition(userLocation);
          map.panTo(userLocation);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map, userMarker]);

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
    const newVisibility = markers[0].getVisible() ? false : true;      ///disabled marker faaltu cheez hai
    markers.forEach(marker => marker.setVisible(newVisibility));
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input id="origin" type="text" placeholder="Origin" />
        <input id="destination" type="text" placeholder="Destination" />
        <button onClick={calculateRoute}>Calculate Route</button>
        <button onClick={toggleHeatmap}>Toggle Heatmap</button>
        <button onClick={toggleMarkers}>Toggle Markers</button>
      </div>
      <div ref={mapRef} style={{ height: '630px', width: '100%' }} />
    </div>
  );
};

export default MapComponent;
