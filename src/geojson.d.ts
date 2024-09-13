// src/geojson.d.ts
declare module 'geojson' {
    export interface FeatureCollection<T> {
      type: 'FeatureCollection';
      features: T[];
    }
  
    export interface Feature<G, P> {
      type: 'Feature';
      geometry: G;
      properties: P;
    }
  
    export interface Point {
      type: 'Point';
      coordinates: [number, number];
    }
  
    export interface GeoJsonProperties {
      [key: string]: any;
    }
  }
  