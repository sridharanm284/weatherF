import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl'; // Import Mapbox types

mapboxgl.accessToken = 'pk.eyJ1IjoiZHNkYXNhIiwiYSI6ImNtMG03NHN1bzAzc3cya3NkbW9maWI0c20ifQ.ZQ2RyZ2Kg_QW5IS1v3RA-A';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null); // Set the type for the map as Map | null
  const [layer, setLayer] = useState<string>('temperature');
  const [timestamp, setTimestamp] = useState<string | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map) {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2,
      });

      mapInstance.on('load', () => {
        setMap(mapInstance); // Correct type here
      });
    }
  }, [map]);

  const changeLayer = (newLayer: string, newTimestamp: string) => {
    if (map) { // Ensure map is not null
      // Remove the old layer if it exists
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
      // Add the new layer
      map.addLayer({
        id: newLayer,
        type: 'raster',
        source: {
          type: 'raster',
          tiles: [
            `https:/localhost:8000/converter/api/${newLayer}/{z}/{x}/{y}?timestamp=${newTimestamp}`
          ],
        },
      });
      setLayer(newLayer);
      setTimestamp(newTimestamp); // Set the new timestamp
    }
  };

  const updateTimestamp = (newTimestamp: string) => {
    if (map) { // Ensure map is not null
      setTimestamp(newTimestamp); // Update timestamp
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (map) {
      interval = setInterval(() => {
        const newTimestamp = Date.now().toString();
        updateTimestamp(newTimestamp);
      }, 60000); 
    }
    return () => clearInterval(interval); 
  }, [map]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: '50%', height: '400px' }} />
      <div>
        <button onClick={() => changeLayer('temperature', timestamp || '')}>
          Temperature Layer
        </button>
        <button onClick={() => changeLayer('precipitation', timestamp || '')}>
          Precipitation Layer
        </button>
      </div>
      <div>Timestamp: {timestamp}</div>
    </div>
  );
};

export default MapComponent;
