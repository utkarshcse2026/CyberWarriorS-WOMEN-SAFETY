'use client';
import React, { useState, useCallback } from 'react';

const PredictionTest: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const getSafeRoadPrediction = useCallback(async (route: any) => {
    try {
      const response = await fetch('http://localhost:5000/predict_safety', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Safe Route Prediction:', data.safeRoute); // Log the result to the console
    } catch (error) {
      console.error('Failed to fetch safety prediction:', error);
    }
  }, []);

  const handleRouteCalculate = useCallback(() => {
    if (!origin || !destination) {
      console.log('Origin and destination must be provided');
      return;
    }

    // Simulate a directions result object
    const directionsResult = {
      routes: [
        {
          legs: [
            {
              start_address: origin,
              end_address: destination,
              distance: { text: '10 km', value: 10000 },
              duration: { text: '20 mins', value: 1200 },
            },
          ],
        },
      ],
    };

    console.log('Simulated Directions Result:', directionsResult);
    getSafeRoadPrediction(directionsResult.routes[0].legs);
  }, [origin, destination, getSafeRoadPrediction]);

  return (
    <div>
      <div className="controls">
        <input
          type="text"
          placeholder="Enter origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={handleRouteCalculate}>Calculate Safe Route</button>
      </div>
    </div>
  );
};

export default PredictionTest;







// 'use client'
// import React from 'react'
// import {APIProvider, Map, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
// const Page = () => {
//   return (
//     <APIProvider apiKey={"AIzaSyAaRnCKVVSWGR159MyTF6rV7NMIPsW960c"} onLoad={() => console.log('Maps API has loaded.')}>
//       <h1>Gmaps</h1>
//         <Map
//         defaultZoom={13}
//         defaultCenter={ { lat: -33.860664, lng: 151.208138 } }
//         onCameraChanged={ (ev: MapCameraChangedEvent) =>
//             console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
//         }>
//         </Map>
//     </APIProvider>
// );
// }

// export default Page
