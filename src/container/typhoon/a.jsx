// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
// import store from '../../store';
// import { useSelector } from 'react-redux';
// import WeatherLoader from "../../components/loader";
// import './style/_index.scss'
// import mapboxgl from "mapbox-gl"; 
// import * as turf from "@turf/turf";
// import cyclone_0 from './../../assets/vectos/cyclone_0.png'
// import cyclone_1 from './../../assets/vectos/cyclone_1.png'
// import cyclone_2 from './../../assets/vectos/cyclone_2.png'
// import cyclone_3 from './../../assets/vectos/cyclone_3.png'
// import cyclone_4 from './../../assets/vectos/cyclone_4.png'
// import cyclone_5 from './../../assets/vectos/cyclone_5.png'

// mapboxgl.accessToken = "pk.eyJ1IjoiZHNkYXNhIiwiYSI6ImNsbDF5dTlrNTBhYTUzanFvbmVtOGp6aWMifQ.Qz5I6EJY4PZbXXvmfXKhFQ";

// const drawerWidth = 0;

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
//   open?: boolean;
// }>(({ theme, open }) => ({
//   height: '82vh',
//   display: 'flex',
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const typhon_icon: any = {0: cyclone_0, 1: cyclone_1, 2: cyclone_2, 3: cyclone_3, 4: cyclone_4, 5: cyclone_5};

// interface ITyphonCoords {
//   latlng: [number, number];
//   info: string;
// }

// interface IUserGeoCoords {
//   lat: string;
//   lng: string;
// }


// export default function TyphoonComponent() {
//   const data = useSelector((state: any) => state?.app);
//   const [sn, setSn] = useState(localStorage.getItem('sideNav'));
//   const windowWidth = useRef(window.innerWidth);
//   const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
//   const [loading, setLoading] = useState<any>(true);

//   useEffect(() => {
//     const l = localStorage.getItem('sideNav');
//     setSn(l);
//   }, []);

//   useEffect(() => {
//     store.dispatch({
//       type: 'TOGGLE_MENU',
//       payload: windowWidth.current > 1000 ? true : false,
//     });
//   }, []);

//   useEffect(() => {
//     setOpen(data.toggle);
//   }, [data]);

//   const [fetchedDatas, setFetchedDatas] = useState<any>(Object());
//   const [stormDatas, setStormDatas] = useState<any>();
//   const [userGeoCords, setuserGeoCords] = useState<IUserGeoCoords>({
//     lat: "1.290270",
//     lng: "103.851959",
//   });
//   const [TyphonCoords, setTyphonCoords] = useState<any>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       const response_storm = await fetch(`http://localhost:8000/api/stormdatas/3502`)
//       const data_storm = await response_storm.json()
//       console.log(userGeoCords)
//       setStormDatas(data_storm)
//       setTyphonCoords(data_storm.map((data: any) => Object({...data, latlng: [data.lon, data.lat], info: (data.date_utc === undefined) ? '-' : `${new Date(data.date_utc).toDateString()},${new Date(data.date_utc).toLocaleTimeString()}`})))
//     };
//     fetchData();
//   }, [setStormDatas]);

  
//   const mapContainer = useRef<HTMLDivElement | null>(null);
//   const [isStyleLoaded, setIsStyleLoaded] = useState(false);

//   const map = useRef<mapboxgl.Map | null>(null);
//   const [zoom, setZoom] = useState<number>(6);


//   const userCircleRadius = ["warning_radius1_frequency", "warning_radius2_frequency", "warning_radius3_frequency"]
//   const userCircleColors: any = {
//     warning_radius1_frequency: "green",
//     warning_radius2_frequency: "red",
//     warning_radius3_frequency: "blue",
//   }

//   const circleRadius = ["kts_34_ne", "kts_50_ne", "kts_64_ne", "kts_80_ne"]
//   const circleColors: any = {
//     kts_34_ne: "green",
//     kts_50_ne: "red",
//     kts_64_ne: "blue",
//     kts_80_ne: 'yellow'
//   }
//   const [activeRadius, setActiveRadius] = useState<string[] | null>([]);

//   useEffect(() => {
//     if (!map.current) return;
//     showClicle();
//   }, [activeRadius, setActiveRadius]);

//   function returnCycloneRange(value: number) {
//     if (value < 74) { 
//       return 0
//     } else if ((value >= 75) && (value <= 95)) {
//       return 1
//     } else if ((value >= 96) && (value <= 110)) {
//       return 2
//     } else if ((value >= 111) && (value <= 129)) {
//       return 3
//     } else if ((value >= 130) && (value < 156)) {
//       return 4
//     } else if (value >= 157) {
//       return 5
//     } else {
//       return 0
//     }
//   }

//   // display circles as per the button click
//   const showClicle = () => {
//     if (map.current && activeRadius) {
//       circleRadius.forEach((radius, rIndex) => {
//         TyphonCoords.forEach((data: any, index: number) => {
//           const layerId = `circle${index}-${rIndex}`;
//           if (map.current!.getLayer(layerId)) {
//             const visibility = activeRadius.includes(radius)
//               ? "visible"
//               : "none";
//             map.current!.setLayoutProperty(layerId, "visibility", visibility);
//           }
//         });
//       });
//     }
//   };

//   const lableGeoJSON = {
//     type: "FeatureCollection",
//     features: TyphonCoords.map((item: any, index: number) => ({
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: item.latlng,
//       },
//       properties: {
//         title: index,
//       },
//     })),
//   };

//   useEffect(() => {
//     const renderMap = async () => {
//       if (map.current) return; // If map is already initialized, exit

//       if (mapContainer.current) {
//         let latlong: any = {}
//         try {
//           const response = await fetch(`http://localhost:8000/api/typhoon/${localStorage.getItem('fid')}/`)
//           const data = await response.json()
//           console.log(data)
//           setuserGeoCords(Object({lat: data.model_data.lat.toString(), lng: data.model_data.long.toString()}))
//           setFetchedDatas(data)
//           latlong = data.model_data
//         } catch { 
//           latlong = Object({
//             lat: "1.290270",
//             long: "103.851959",        
//           })
//         }
//         map.current = new mapboxgl.Map({
//           container: mapContainer.current,
//           style: "mapbox://styles/mapbox/streets-v11",  // flat Map
//           // style: "mapbox://styles/mapbox/streets-v12", globe Map
//           center: [latlong.long, latlong.lat],
//           zoom: zoom,
//           minZoom: 4,
//         });

//         map.current.on("load", function () {
//           setIsStyleLoaded(true);
//         });
//         map.current.addControl(
//           new mapboxgl.NavigationControl({ showCompass: false }),
//           "top-right"
//         );
//         map.current.addControl(new mapboxgl.FullscreenControl());

//       }
//     }
//     renderMap()
//   }, [userGeoCords, setuserGeoCords]);

//   // render map
//   useEffect(() => {
//     if (isStyleLoaded) {
//       if (map.current) {
//         const currentMap = map.current; // Access the current map
//         currentMap.on("move", () => {
//           setuserGeoCords({
//             lng: parseFloat(currentMap.getCenter().lng.toFixed(4)).toString(),
//             lat: parseFloat(currentMap.getCenter().lat.toFixed(4)).toString(),
//           });
//           setZoom(parseFloat(currentMap.getZoom().toFixed(2)));
//         });
//       }

//       if (map.current) {       
//         const marker = new mapboxgl.Marker()
//           .setLngLat([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)])
//           .addTo(map.current);

//         new mapboxgl.Popup({
//           offset: 35  ,
//           closeButton: false,
//           closeOnClick: false,
//         })
//           .setHTML(`<b>${localStorage.getItem('project')}</b>`)
//           .setLngLat([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)])
//           .addTo(map.current);
//       }

//       let _center = turf.point([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)]);

//       userCircleRadius.forEach((radius, rIndex) => {
//         const circleLayerID = `defaultCircle-${rIndex}`;
//         if (map.current) {
//           let _options: any = {
//             steps: 80,
//             units: "kilometers",
//           };
//           let _circle = turf.circle(_center, ((fetchedDatas === undefined) || (fetchedDatas.cyclone_data === undefined)) ? 0 : fetchedDatas.cyclone_data[radius], _options);  
//           map.current.addSource(`circleData-${rIndex}`, {
//             type: "geojson",
//             data: _circle,
//           });
  
//           map.current.addLayer({
//             id: `circle-fill-${rIndex}`,
//             type: "fill",
//             source: `circleData-${rIndex}`,
//             paint: {
//               "fill-color": userCircleColors[radius],
//               "fill-opacity": 0.2
//             },
//           });
//         }
//       });

//       if (map.current) {
//         map.current.addLayer({
//           id: "text-layer",
//           type: "symbol",
//           source: {
//             type: "geojson",
//             data: lableGeoJSON,
//           } as any,
//           layout: {
//             "text-field": "{title}",
//             "text-offset": [-2, 0],
//             "text-anchor": "right",
//             "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
//           },
//         });
//       }

//       const lineGeoJSON = {
//         type: "Feature",
//         geometry: {
//           type: "LineString",
//           coordinates: TyphonCoords.map((item: any) => {
//             return item.latlng;
//           }),
//         },
//       };

//       if (map.current) {
//         map.current.addLayer({
//           id: "line-layer",
//           type: "line",
//           source: {
//             type: "geojson",
//             data: lineGeoJSON,
//           } as any,
//           layout: {
//             "line-join": "round",
//             "line-cap": "round",
//           },
//           paint: {
//             "line-color": "#000000",
//             "line-width": 2,
//           },
//         });
//       }

//       TyphonCoords.forEach((item: any, index: number) => {
//         const markerElement = document.createElement("img");
//         markerElement.src = typhon_icon[returnCycloneRange(item.speed_kts)];
//         markerElement.style.height = "40px";

//         if (map.current) {
//           new mapboxgl.Marker({
//             element: markerElement,
//           })
//             .setLngLat(item.latlng)
//             .addTo(map.current);

//           new mapboxgl.Popup({
//             offset: 10,
//             closeButton: false,
//             closeOnClick: false,
//             anchor: "bottom",
//             className: "hover-over"
//           })
//             .setHTML(`<center>${item.info}<br>${((item === undefined) || (item.max_wind_speed === undefined)) ? "-" : item.max_wind_speed} kts</center>`)
//             .setLngLat(item.latlng)
//             .addTo(map.current);
//         }

//         circleRadius.forEach((radius, rIndex) => {
//           if (map.current) {

//             let _center = turf.point(item.latlng);
//             let _options: any = {
//               steps: 80,
//               units: "kilometers",
//             };
//             let _circle = turf.circle(_center, ((item === undefined) || (item[radius] === undefined)) ? 0 : item[radius], _options);
//             const sourceId = `circleData-${index}-${rIndex}`;
  
//             map.current.addSource(sourceId, {
//               type: "geojson",
//               data: _circle,
//             });
  
//             const layerId = `circle-fill-${index}-${rIndex}`;
//             map.current.addLayer({
//               id: layerId,
//               type: "line",
//               source: sourceId,
//               paint: {
//                 "line-color": circleColors[radius],
//                 "line-width": 3,
//               },
//             });            
//           }
//         });
//       });
//     }
//   }, [isStyleLoaded, fetchedDatas]);

//   return (
//     <div className={open ? "sideNavOpen" : "sideNavClose"}>
//       <div className="sidebar">
//         <span>
//           Longitude: {userGeoCords.lng}
//         </span>
//         <span>
//           Latitude: {userGeoCords.lat}
//         </span>
//         <span>        
//           Zoom: {zoom}
//         </span>
//         <div style={{ display: 'flex', flexDirection: "column" }}>
//           {circleRadius.slice(0, 4).map(circle =>
//             <button
//               key={circle}
//               className="radius-btn"
//               onClick={() => setActiveRadius([circle])}
//             >
//               {circle.split('_').reverse().slice(1).join(" ")}
//             </button>
//           )}
//           <button
//             className="radius-btn"
//             onClick={() => setActiveRadius(circleRadius)}
//           >
//             Show All
//           </button>
//         </div>
//       </div>

//       <div ref={mapContainer} className="map-container" />
//     </div>                
//   );
  
// }