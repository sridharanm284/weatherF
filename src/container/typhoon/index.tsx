import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import store from '../../store';
import { useSelector } from 'react-redux';
import WeatherLoader from "../../components/loader";
import CycloneIcon from '@mui/icons-material/Cyclone';
import TornadoIcon from '@mui/icons-material/Tornado';
import './style/_index.scss'
import mapboxgl from "mapbox-gl"; 
import * as turf from "@turf/turf";
import cyclone_0 from './../../assets/vectos/cyclone_0.png'
import cyclone_1 from './../../assets/vectos/cyclone_1.png'
import cyclone_2 from './../../assets/vectos/cyclone_2.png'
import cyclone_3 from './../../assets/vectos/cyclone_3.png'
import cyclone_4 from './../../assets/vectos/cyclone_4.png'
import cyclone_5 from './../../assets/vectos/cyclone_5.png'
import cyclone_0_g from './../../assets/vectos/cyclone_0_g.png'
import cyclone_1_g from './../../assets/vectos/cyclone_1_g.png'
import cyclone_2_g from './../../assets/vectos/cyclone_2_g.png'
import cyclone_3_g from './../../assets/vectos/cyclone_3_g.png'
import cyclone_4_g from './../../assets/vectos/cyclone_4_g.png'
import cyclone_5_g from './../../assets/vectos/cyclone_5_g.png'



mapboxgl.accessToken = "pk.eyJ1IjoiZHNkYXNhIiwiYSI6ImNsbDF5dTlrNTBhYTUzanFvbmVtOGp6aWMifQ.Qz5I6EJY4PZbXXvmfXKhFQ";

const drawerWidth = 0;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  height: '82vh',
  display: 'flex',
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const typhon_icon: any = {0: cyclone_0, 1: cyclone_1, 2: cyclone_2, 3: cyclone_3, 4: cyclone_4, 5: cyclone_5};
const typhon_icon_g: any = {0: cyclone_0_g, 1: cyclone_1_g, 2: cyclone_2_g, 3: cyclone_3_g, 4: cyclone_4_g, 5: cyclone_5_g};

interface ITyphonCoords {
  latlng: [number, number];
  info: string;
}

interface IUserGeoCoords {
  lat: string;
  lng: string;
}


export default function TyphoonComponent() {
  const data = useSelector((state: any) => state?.app);
  const [sn, setSn] = useState(localStorage.getItem('sideNav'));
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [loading, setLoading] = useState<any>(true);

  useEffect(() => {
    const l = localStorage.getItem('sideNav');
    setSn(l);
  }, []);

  useEffect(() => {
    store.dispatch({
      type: 'TOGGLE_MENU',
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  const popupbar = useRef(null)
  const [fetchedDatas, setFetchedDatas] = useState<any>(Object());
  const [stormDatas, setStormDatas] = useState<any>([]);
  const [trackDatas, setTrackDatas] = useState<any>([]);
  const [mapHovers, setMapHovers] = useState<any>([]);
  const [userGeoCords, setuserGeoCords] = useState<IUserGeoCoords>({
    lat: "1.290270",
    lng: "103.851959",
  });
  const [TyphonCoords, setTyphonCoords] = useState<any>([])
  // Define the calculateDistance function
  function calculateDistance(lat1: any, lon1:any, lat2:any, lon2:any) {
    const R = 6373.0; // approximate radius of Earth in kilometers

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    const dLon = lon2Rad - lon1Rad;
    const dLat = lat2Rad - lat1Rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  }

  function coronical(data: number) {
    let calc: Array<Array<any>> = [];
    let calcData: any = {
      NNE: 22.5,
      NE: 45,
      ENE: 67.5,
      E: 90,
      EFE: 112.5,
      FE: 135,
      FFE: 157.5,
      S: 180,
      SSW: 202.5,
      SW: 225,
      WSW: 247.5,
      W: 270,
      WNW: 292.5,
      NW: 315,
      NNW: 337.5,
      N: 360,
    };
    for (const d in calcData) {
      calc.push([Math.abs(data - parseFloat(calcData[d])), d]);
    }
    calc.sort((x, y) => x[0] - y[0]);
    return calc[0][1]; 
  }


  useEffect(() => {
    const fetchData = async () => {
      const response_storm = await fetch(`http://localhost:8000/api/stormdatas/`)
      const data_storm = await response_storm.json()
      setStormDatas(data_storm.storm_datas)
      setTrackDatas(data_storm.track_datas)
      setMapHovers(data_storm.map_hovers)
      
      setTyphonCoords(data_storm.storm_datas.map((datas: any) =>
      datas.map((data: any) => {
        const utcDate = new Date(data.date_utc + 'Z');
        const day = utcDate.getUTCDate().toString().padStart(2, '0');
        const time = `${utcDate.getUTCHours().toString().padStart(2, '0')}:${utcDate.getUTCMinutes().toString().padStart(2, '0')}`;
        const formattedDate = `${day}/${time}`;
    
        return {
          ...data,
          latlng: [data.lon, data.lat],
          info: (data.date_utc === undefined)
            ? '-'
            : `Time UTC: ${formattedDate}`
        };
      })
    ));
  
      
    };
    fetchData();
  }, [setStormDatas, setTrackDatas]);

  
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState<number>(6);

  const userCircleRadius = ["warning_radius1_frequency", "warning_radius2_frequency", "warning_radius3_frequency"]
  const userCircleColors: any = {
    warning_radius1_frequency: "green",
    warning_radius2_frequency: "yellow",
    warning_radius3_frequency: "red",
  }

  const circleRadius = ["kts_34_ne", "kts_50_ne", "kts_64_ne", "kts_80_ne"]
  const circleColors: any = {
    kts_34_ne: "green",
    kts_50_ne: "red",
    kts_64_ne: "blue",
    kts_80_ne: 'yellow'
  }
  const [activeRadius, setActiveRadius] = useState<string[]>([]);

  useEffect(() => {
    if (!map.current) return;
    showClicle();
  }, [activeRadius, setActiveRadius]);

  function returnCycloneRange(value: number) {
    if (value < 74) { 
      return 0
    } else if ((value >= 75) && (value <= 95)) {
      return 1
    } else if ((value >= 96) && (value <= 110)) {
      return 2
    } else if ((value >= 111) && (value <= 129)) {
      return 3
    } else if ((value >= 130) && (value < 156)) {
      return 4
    } else if (value >= 157) {
      return 5
    } else {
      return 0
    }
  }

  // display circles as per the button click
  const showClicle = () => {
    if (map.current && activeRadius) {
      circleRadius.forEach((radius, rIndex) => {
        TyphonCoords.forEach((datas: any, index: number) => 
          datas.forEach((data: any, index2: number) => {
            const layerId = `circle-fill-${index}-${index2}-${rIndex}`;
            //console.log(layerId)
            if (map.current!.getLayer(layerId)) {
              const visibility = activeRadius.includes(radius)
                ? "visible"
                : "none";
              map.current!.setLayoutProperty(layerId, "visibility", visibility);
            }
        }));
      });
    }
  };

  useEffect(() => {
    const renderMap = async () => {
      if (map.current) return; // If map is already initialized, exit
      if (mapContainer.current) {

      let latlong: any = {}
      try {
        const response = await fetch(`http://localhost:8000/api/typhoon/${localStorage.getItem('fid')}/`)
        const data = await response.json()
        
        setuserGeoCords(Object({lat: data.model_data.lat.toString(), lng: data.model_data.long.toString()}))
        setFetchedDatas(data)
        latlong = data.model_data
      } catch { 
        latlong = Object({
          lat: "1.290270",
          long: "103.851959",        
        })
      }

      
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v11",  // flat Map
          
          center: [latlong.long, latlong.lat],
          zoom: zoom,
          minZoom: 2,
        });

        map.current.on("load", function () {
          setIsStyleLoaded(true);
        });
        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          "top-right"
        );
        map.current.addControl(new mapboxgl.FullscreenControl());

      }
    }
    renderMap()
  }, [userGeoCords]);

  // render map
  useEffect(() => {
    if (isStyleLoaded) {
      if (map.current) {
        const currentMap = map.current; // Access the current map
        currentMap.on("move", () => {
          setuserGeoCords({
            lng: parseFloat(currentMap.getCenter().lng.toFixed(4)).toString(),
            lat: parseFloat(currentMap.getCenter().lat.toFixed(4)).toString(),
          });
          setZoom(parseFloat(currentMap.getZoom().toFixed(2)));
        });
      }

      if (map.current) {       
        const marker = new mapboxgl.Marker()
          .setLngLat([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)])
          .addTo(map.current);
        new mapboxgl.Popup({
          offset: 35  ,
          closeButton: false,
          closeOnClick: false,
        })
          .setHTML(`<b>${localStorage.getItem('project')}</b>`)
          .setLngLat([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)])
          .addTo(map.current);
      }
      
      if (userGeoCords.lng !== undefined && userGeoCords.lat !== undefined) {
        // Convert user coordinates to a Turf.js point
        const userCenter = turf.point([parseFloat(userGeoCords.lng), parseFloat(userGeoCords.lat)]);
        
        // Check if map and fetchedDatas are available
        if (map.current && fetchedDatas && fetchedDatas.cyclone_data) {
          userCircleRadius.forEach((radius, rIndex) => {
            const cycloneData = fetchedDatas.cyclone_data[radius];
        
            // Check if cycloneData is available
            if (cycloneData !== undefined) {
              const warningRadiusX = cycloneData + CIRCLE_X_RADIUS_OFFSET;
              const warningRadiusY = cycloneData + CIRCLE_Y_RADIUS_OFFSET; // Adjust this value for the oval shape
                    
              const northPoint = turf.destination(userCenter, warningRadiusY, 0);
        
              map.current!.addSource(`northPoint-${rIndex}`, {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: [northPoint],
                },
              });
        
              map.current!.addLayer({
                id: `north-point-${rIndex}`,
                type: 'circle',
                source: `northPoint-${rIndex}`,
                paint: {
                  'circle-color': 'red',
                  'circle-radius': 6,
                },
              });
      
              const ellipseFeature = turf.ellipse(userCenter, warningRadiusX, warningRadiusY, {
                steps: 64,
              });
        
              map.current!.addSource(`ellipseData-${rIndex}`, {
                type: 'geojson',
                data: ellipseFeature,
              });
        
              map.current!.addLayer({
                id: `ellipse-fill-${rIndex}`,
                type: 'fill',
                source: `ellipseData-${rIndex}`,
                paint: {
                  'fill-color': userCircleColors[radius],
                  'fill-opacity': 0.2,
                },
              });
        
              map.current!.addLayer({
                id: `ellipse-stroke-${rIndex}`,
                type: 'line',
                source: `ellipseData-${rIndex}`,
                paint: {
                  'line-color': userCircleColors[radius],
                  'line-width': 2,
                },
              });
            }
          });
        } else {
          // Handle the case when map or fetchedDatas are not available
        }
      } else {
        // Handle the case when userGeoCords.lng or userGeoCords.lat are undefined
      }
      
      // Constants for oval shape dimensions
      const CIRCLE_X_RADIUS_OFFSET = 300;
      const CIRCLE_Y_RADIUS_OFFSET = 200;
      
      
      stormDatas.map((datas: any) =>
        datas.map((data: any) => {if ((map.current) && (data.storm_category_id === 54)) {
          const marker = new mapboxgl.Marker()
            .setLngLat([parseFloat(data.lon), parseFloat(data.lat)])
            .addTo(map.current);
          new mapboxgl.Popup({
            offset: 35  ,
            closeButton: false,
            closeOnClick: false,
          })
            .setHTML(`<b>${localStorage.getItem('project')}</b>`)
            .setLngLat([parseFloat(data.lon), parseFloat(data.lat)])
            .addTo(map.current);
        }}))    

      TyphonCoords.map((main_datas: any, main_index: number) => {
        
        const labelGeoJSON = {
          type: "FeatureCollection",
          features: main_datas.map((item: any, index: number) => ({ 
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: item.latlng,
            },
            properties: {
              title: main_datas.length - index,
            },
          }))
        }

        if (map.current) {
          map.current.addLayer({
            id: `text-layer-${main_index}`,
            type: "symbol",
            source: {
              type: "geojson",
              data: labelGeoJSON,
            } as any,
            layout: {
              "text-field": "{title}",
              "text-offset": [-2, 0],
              "text-anchor": "right",
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            },
          });
        } 

        const lineGeoJSON = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: main_datas.map((item: any) => {
              return item.latlng;
            }),
          },
        };

        if (map.current) {
          map.current.addLayer({
            id: `line-layer-${main_index}`,
            type: "line",
            source: {
              type: "geojson",
              data: lineGeoJSON,
            } as any,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#000000",
              "line-width": 2,
            },
          });
        }

        main_datas.reverse();

        main_datas.forEach((item: any, index: number) => {

          const markerElement = document.createElement("img");
          const userDistance = calculateDistance(
            parseFloat(userGeoCords.lat), parseFloat(userGeoCords.lng),
            parseFloat(item.latlng[1]), parseFloat(item.latlng[0])
          );
          const cyclone_range_icon = returnCycloneRange(
            ((item.speed_kts !== undefined) && (item.distance !== undefined))
            ? 0
            : ((item.max_wind_speed !== undefined) ? (item.max_wind_speed) : (item.speed_kts))
          )
          markerElement.src = ((new Date(item.date_utc).toLocaleDateString() === new Date().toLocaleDateString()) || (new Date(item.date_utc) >= new Date())) ? typhon_icon[cyclone_range_icon] : typhon_icon_g[cyclone_range_icon];
          markerElement.style.height = "30px";
          markerElement.className = 'rotate-animation'

          if (map.current) {

            const tableHeader = [
              'Index', 
              'Storm Date Time (UTC)', 
              'Positions', 
              'Distance (nm)', 
              'System Speed (kn)', 
              'Pressure (hPa)', 
              'Max Wind (kn)', 
              '34-knot radius', 
              '50-knot radius', 
              '64-knot radius', 
              '80-knot radius'
            ];

            const tableHTML = `
              <div id = "demo">
                <div class="popup-table">
                  <table>
                    <thead>
                      <tr>${tableHeader.map(head => `<td><strong>${head}</strong></td>`).join('')}</tr>
                    </thead>
                    <tbody>
                      ${main_datas.map((typhoon: any, index: number) => {
                        const distanceToUser = calculateDistance(
                          parseFloat(userGeoCords.lat),
                          parseFloat(userGeoCords.lng),
                          parseFloat(typhoon.latlng[1]),
                          parseFloat(typhoon.latlng[0])
                        ).toFixed(0);
                        // tableHTML.id = "demo"
                        const correspondingTyphoon = main_datas[index];
                        const utcDate = new Date(correspondingTyphoon.date_utc + 'Z');
                        const day = utcDate.getUTCDate().toString().padStart(2, '0');
                        const time = `${utcDate.getUTCHours().toString().padStart(2, '0')}:${utcDate.getUTCMinutes().toString().padStart(2, '0')}`;
                        const formattedDate = `${day}/${time}`;

                        return `
                        <tr>
                          <td>${ index + 1}</td>
                          <td>${formattedDate}</td>
                          <td>${Math.trunc(correspondingTyphoon.lat * 10) / 10}N ${Math.trunc(correspondingTyphoon.lon * 10) / 10}E</td>
                          <td>${distanceToUser}</td>
                          <td>${correspondingTyphoon.speed_kts}</td>
                          <td>${correspondingTyphoon.central_pressure}</td>
                          <td>${correspondingTyphoon.max_wind_speed}</td>
                          <td>${correspondingTyphoon.kts_34_ne}</td>
                          <td>${correspondingTyphoon.kts_50_ne}</td>
                          <td>${correspondingTyphoon.kts_64_ne}</td>
                          <td>${correspondingTyphoon.kts_80_ne}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                  </table>
                <div>
              </div>`;

            const popup = new mapboxgl.Popup({
              offset: 125,
              maxWidth: 'fit-content',
              anchor: 'bottom-right',
              className: 'popup-main-table',
            })
              .setHTML(tableHTML)
            
            new mapboxgl.Marker({
              element: markerElement,
            })
              .setLngLat(item.latlng)
              .addTo(map.current)
              .setPopup(popup);

            const popupContent = `
              <center>
                ${item.info}<br>
                ${userDistance.toFixed(2)} NM<br>
                
                ${
                  item.max_wind_speed !== undefined
                    ? `Max Wind Speed: ${item.max_wind_speed} kts<br>` 
                    : ''
                }
                ${
                  (item.speed_kts !== undefined && item.distance_in_miles !== undefined)
                    ? `Speed: ${item.speed_kts} kts<br> ${coronical(item.distance_in_miles.toFixed(2))} `
                    : '-'
                }
              </center>`;

            new mapboxgl.Popup({
              offset: 10,
              closeButton: false,
              closeOnClick: false,
              anchor: "bottom",
              className: "hover-over"
            })
              .setHTML(popupContent)
              .setLngLat(item.latlng)
              .addTo(map.current);
          }
          

          function generateUniqueSourceId(baseId:any) {
            let sourceId = baseId;
            let counter = 0;
            while (map.current!.getSource(sourceId)) {
              counter += 1;
              sourceId = `${baseId}-${counter}`;
            }
            return sourceId;
          }
          
          // Inside your useEffect where you add sources
          circleRadius.forEach((radius, rIndex) => {
            if (map.current) {
              const sourceId = generateUniqueSourceId(`circleData-${main_index}-${index}-${rIndex}`);
          
              let _center = turf.point(item.latlng);
              let _options = {
                steps: 80,
                 units: 'kilometers' as 'kilometers',
              };
              let _circle = turf.circle(_center, ((item === undefined) || (item[radius] === undefined)) ? 0 : item[radius], _options);
          
              map.current.addSource(sourceId, {
                type: "geojson",
                data: _circle,
              });
          
              const layerId = `circle-fill-${main_index}-${index}-${rIndex}`;
              map.current.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                paint: {
                  "line-color": circleColors[radius],
                  "line-width": 3,
                },
              });
            }
          });
          

        });
      });
    }
  }, [isStyleLoaded, fetchedDatas, map]);

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <div className="sidebar">
        <div className={['sidebar-mode', 'icon-menu'].join(' ')}>
          <button
            onClick={() => {
              if (popupbar.current !== null) {}
            }}
            className='mode-button'>
            <CycloneIcon  className='mode-button' 
             />
          </button>
          <button
            onClick={() => {
              if (popupbar.current !== null) {}
            }}
            className='mode-button'>
            <TornadoIcon className='mode-button' />
          </button>
        </div>
        <div className='sidebar-mode'>
          {circleRadius.slice(0, 4).map(circle =>
            <button
              key={circle}
              className={["radius-btn", ((activeRadius.length === 1) && (activeRadius[0] === circle)) ? "active-button" : ""].join(' ')}
              onClick={() => setActiveRadius([circle])}
            >
              {circle.split('_')[1]}
            </button>
          )}
          <button
            className={["radius-btn", (activeRadius.length !== 1) ? "active-button" : ""].join(' ')}
            onClick={() => setActiveRadius(circleRadius)}
          >
            All
          </button>
        </div>
        {/*<div className='sidebar-mode'>
          <button className='mode-button'>ECWMF</button>
          <button className='mode-button'>NCEP</button>
        </div>*/}
      </div>
      <div ref={popupbar} className='bottom-bar-popup'>
        {trackDatas.map((data: any) => (
          <span onClick={() => {
            if (map.current !== null) {
              map.current.setCenter([mapHovers[`storm_${data.storm_track_id}`].lon, mapHovers[`storm_${data.storm_track_id}`].lat])
            }
          }} className='bottom-bar-box'>{data.storm_name}</span>
        ))}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>                
  );
  
}