import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './MapComponents.scss';

interface TimestampedLayerProps {
  timestamp: string;
  previousTimestamp: string | null;
  layerType: 'temperature' | 'pressure' | 'precipitation' | 'wind';
}

const TimestampedLayer: React.FC<TimestampedLayerProps> = ({ timestamp, previousTimestamp, layerType }) => {
  const map = useMap();
  const currentLayerRef = useRef<L.ImageOverlay | null>(null);
  const previousLayerRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    const imageLayerUrl = `http://localhost:8000/converter/${layerType}-layer/?timestamp=${timestamp}`;
    const prevImageLayerUrl = previousTimestamp
      ? `http://localhost:8000/converter/${layerType}-layer/?timestamp=${previousTimestamp}`
      : null;

    const bounds: L.LatLngBoundsExpression = [
      [90, -180],
      [-90, 180],
    ];

    const newImageLayer = L.imageOverlay(imageLayerUrl, bounds, {
      opacity: 0.7,
      zIndex: 2,
      interactive: false,
    });

    newImageLayer.addTo(map);
    currentLayerRef.current = newImageLayer;

    if (previousLayerRef.current) {
      map.removeLayer(previousLayerRef.current);
    }

    previousLayerRef.current = newImageLayer;

    return () => {
      if (currentLayerRef.current) {
        map.removeLayer(currentLayerRef.current);
      }
    };
  }, [timestamp, previousTimestamp, map, layerType]);

  return null;
};

const MapComponent: React.FC = () => {
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [currentTimestampIndex, setCurrentTimestampIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const previousTimestampRef = useRef<string | null>(null);
  const [layerType, setLayerType] = useState<'temperature' | 'pressure' | 'precipitation' | 'wind'>('temperature');

  useEffect(() => {
    axios
      .get('http://localhost:8000/converter/timestamps')
      .then((response) => {
        setTimestamps(response.data);
      })
      .catch((error) => {
        console.error('Error fetching timestamps', error);
      });
  }, []);

  useEffect(() => {
    if (timestamps.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTimestampIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % timestamps.length;
          setProgress(((nextIndex + 1) / timestamps.length) * 100);
          previousTimestampRef.current = timestamps[prevIndex];
          return nextIndex;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timestamps, isPlaying]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="map-container" style={{ height: '60vh', width: '60vw', top: '2vh', left: '2vh' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={1}
        minZoom={2}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        worldCopyJump={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Use MapTiler's backdrop map */}
        <TileLayer
          url="https://api.maptiler.com/maps/backdrop/256/{z}/{x}/{y}.png?key=SNlf3fFMC5k0oRAGSavO"
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
          zIndex={1}
         
        />

        {timestamps.length > 0 && (
          <TimestampedLayer
            timestamp={timestamps[currentTimestampIndex]}
            previousTimestamp={previousTimestampRef.current}
            layerType={layerType}
          />
        )}
      </MapContainer>

      <div className="progress-overlay">
        <div className="timestamp">
          {timestamps.length > 0 ? formatDate(timestamps[currentTimestampIndex]) : 'Loading...'}
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <button className="play-pause-btn" onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="layer-switcher">
        <button onClick={() => setLayerType('temperature')} className={layerType === 'temperature' ? 'active' : ''}>
          Temperature
        </button>
        <button onClick={() => setLayerType('pressure')} className={layerType === 'pressure' ? 'active' : ''}>
          Pressure
        </button>
        <button onClick={() => setLayerType('precipitation')} className={layerType === 'precipitation' ? 'active' : ''}>
          Precipitation
        </button>
        <button onClick={() => setLayerType('wind')} className={layerType === 'wind' ? 'active' : ''}>
          wind
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
