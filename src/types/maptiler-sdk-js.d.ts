// src/types/maptiler-sdk-js.d.ts

declare module '@maptiler/sdk' {
    export class Map {
      constructor(options: any);
      on(event: string, callback: Function): void;
      addSource(id: string, source: any): void;
      addLayer(layer: any): void;
      removeLayer(id: string): void;
      removeSource(id: string): void;
      getLayer(id: string): any;
      getSource(id: string): any;
      setPaintProperty(layerId: string, property: string, value: any): void;
    }
  
    export const MapStyle: {
      BACKDROP: string;
    };
  }
  