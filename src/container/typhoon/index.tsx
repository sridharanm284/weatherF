import React, { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import store from "../../store";
import { useSelector } from "react-redux";
import "./styles/_index.scss";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import cyclone_0 from "./../../assets/vectos/cyclone_0.gif";
import cyclone_1 from "./../../assets/vectos/cyclone_1.gif";
import cyclone_2 from "./../../assets/vectos/cyclone_2.gif";
import cyclone_3 from "./../../assets/vectos/cyclone_3.gif";
import cyclone_4 from "./../../assets/vectos/cyclone_4.gif";
import cyclone_5 from "./../../assets/vectos/cyclone_5.gif";
import cyclone_0_g from "./../../assets/vectos/cyclone_0_g.png";
import cyclone_1_g from "./../../assets/vectos/cyclone_1_g.png";
import cyclone_2_g from "./../../assets/vectos/cyclone_2_g.png";
import cyclone_3_g from "./../../assets/vectos/cyclone_3_g.png";
import cyclone_4_g from "./../../assets/vectos/cyclone_4_g.png";
import cyclone_5_g from "./../../assets/vectos/cyclone_5_g.png";
import axios from "axios";
import { CircularProgress, Button } from '@mui/material';
import cyclone_0_new from "../../assets/vectos/cyclone_0_R.gif";
import cyclone_1_new from "../../assets/vectos/cyclone_1_R.gif";
import cyclone_2_new from "../../assets/vectos/cyclone_2_R.gif";
import cyclone_3_new from "../../assets/vectos/cyclone_3_R.gif";
import cyclone_4_new from "../../assets/vectos/cyclone_4_R.gif";
import cyclone_5_new from "../../assets/vectos/cyclone_5_R.gif";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZHNkYXNhIiwiYSI6ImNtMG03NHN1bzAzc3cya3NkbW9maWI0c20ifQ.ZQ2RyZ2Kg_QW5IS1v3RA-A";

const drawerWidth = 0;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  height: "82vh",
  display: "flex",
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const typhon_icon: any = {
  0: cyclone_0,
  1: cyclone_1,
  2: cyclone_2,
  3: cyclone_3,
  4: cyclone_4,
  5: cyclone_5,
};

const typhon_icon_g: any = {
  0: cyclone_0_g,
  1: cyclone_1_g,
  2: cyclone_2_g,
  3: cyclone_3_g,
  4: cyclone_4_g,
  5: cyclone_5_g,
};

const typhon_icon_new: any = {
  0: cyclone_0_new,
  1: cyclone_1_new,
  2: cyclone_2_new,
  3: cyclone_3_new,
  4: cyclone_4_new,
  5: cyclone_5_new,
};

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
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const l = localStorage.getItem("sideNav");
    setSn(l);
  }, []);

  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  const downloadPDFs = async () => {
    const stormName = "22W TRAMI"; 
    const project = "LOTS-MV ARATSU-14-11574"; 
    
    setLoading((prevLoading) => ({ ...prevLoading, [stormName]: true }));
  
    try {
      
      const response = await axios.post(
        "http://127.0.0.1:8000/converter/downloadpdfthypoon/",
        { storm_name: stormName, project: project },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'blob',
        }
      );
  
      if (response.status === 200 && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `TC_BULLETIN_${stormName}-${project}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert(`No PDF file found for ${stormName} and project ${project}`);
      }
    } catch (error) {
      console.error("Error downloading PDFs:", error);
      alert(`Failed to download PDF for ${stormName} and project ${project}. No PDF available.`);
    } finally {
      setLoading((prevLoading: any) => ({ ...prevLoading, [stormName]: false }));
    }
  };
  
  



  const [btncolor, setBtnColor] = useState<any>({ background: "white" });
  const popupbar = useRef(null);
  const [fetchedDatas, setFetchedDatas] = useState<any>(Object());
  const [stormDatas, setStormDatas] = useState<any>([]);
  const [trackDatas, setTrackDatas] = useState<any>([]);
  const [mapHovers, setMapHovers] = useState<any>([]);
  const [userGeoCords, setuserGeoCords] = useState<any>([]);
    const [TyphonCoords, setTyphonCoords] = useState<any>([]);
    const [warningData, setWarningData] = useState({});

    const calculateDistanceNauticalMiles = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      if (lat1 === lat2 && lon1 === lon2) {
        return 0;
      }
  
      const lat1Rad = (lat1 * Math.PI) / 180;
      const lat2Rad = (lat2 * Math.PI) / 180;
      const dLonRad = ((lon2 - lon1) * Math.PI) / 180;
    
      const distanceNauticalMiles = 
        60 * (180 / Math.PI) *
        Math.acos(
          Math.sin(lat1Rad) * Math.sin(lat2Rad) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad)
        );
    
      return distanceNauticalMiles;
    };
    
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

  let refreshCounter = 0;
  function generateUniqueSourceId(baseId: string) {
    let sourceId = `${baseId}-${refreshCounter}`;
    let counter = 0;
    while (map.current!.getSource(sourceId)) {
      counter += 1;
      sourceId = `${baseId}-${counter}-${refreshCounter}`;
    }
    return sourceId;
  }
  function resetSourceIdCounter() {
    refreshCounter += 1;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded storm data
        const data_storm = {"track_datas": [{"storm_track_id": 413,"storm_name": "10S SEAN","storm_description": null,"status_id": 8,"created_by": 25,"created_on": "2025-01-18","updated_by": 25,"updated_on": "2025-01-19","last_accessed_on": "2025-01-19T03:54:45.645220"}],"storm_datas": [[{"storm_path_data_id": 39656,"storm_path_id": 5191,"id_index": 10,"lat": -34.4,"lon": 111.53000000000004,"date_utc": "2025-01-24T18:00:00","time_utc": "2025-01-24T18:00:00","heading": 118.66318865577938,"speed_kts": 0.0,"max_wind_speed": 30.0,"max_gust": 30.0,"central_pressure": 985.0,"output_unit_id": 24,"kts_34_ne": 0.0,"kts_34_se": 0.0,"kts_34_sw": 0.0,"kts_34_nw": 0.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 62.58649449346342,"storm_category_id": 2,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39657,"storm_path_id": 5191,"id_index": 9,"lat": -33.887426935392085,"lon": 109.14320342518153,"date_utc": "2025-01-24T06:00:00","time_utc": "2025-01-24T06:00:00","heading": 104.47320780885588,"speed_kts": 13.61,"max_wind_speed": 35.0,"max_gust": 45.0,"central_pressure": 980.0,"output_unit_id": 24,"kts_34_ne": 70.0,"kts_34_se": 70.0,"kts_34_sw": 70.0,"kts_34_nw": 70.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 163.35757443489013,"storm_category_id": 2,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39655,"storm_path_id": 5191,"id_index": 8,"lat": -32.51927714790251,"lon": 106.97552408530825,"date_utc": "2025-01-23T18:00:00","time_utc": "2025-01-23T18:00:00","heading": 136.16791832048955,"speed_kts": 11.1,"max_wind_speed": 40.0,"max_gust": 50.0,"central_pressure": 978.0,"output_unit_id": 24,"kts_34_ne": 90.0,"kts_34_se": 90.0,"kts_34_sw": 90.0,"kts_34_nw": 90.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 133.1693724201632,"storm_category_id": 2,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39654,"storm_path_id": 5191,"id_index": 7,"lat": -30.04967084742846,"lon": 105.89595483480171,"date_utc": "2025-01-23T06:00:00","time_utc": "2025-01-23T06:00:00","heading": 165.51027077495837,"speed_kts": 14.26,"max_wind_speed": 45.0,"max_gust": 55.0,"central_pressure": 976.0,"output_unit_id": 24,"kts_34_ne": 100.0,"kts_34_se": 100.0,"kts_34_sw": 100.0,"kts_34_nw": 100.0,"kts_50_ne": 0.0,"kts_50_se": 0.0,"kts_50_sw": 0.0,"kts_50_nw": 0.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 171.1573714796091,"storm_category_id": 2,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39653,"storm_path_id": 5191,"id_index": 6,"lat": -28.452122955897497,"lon": 106.18179306582019,"date_utc": "2025-01-22T18:00:00","time_utc": "2025-01-22T18:00:00","heading": 205.38374628975345,"speed_kts": 6.7,"max_wind_speed": 50.0,"max_gust": 65.0,"central_pressure": 972.0,"output_unit_id": 24,"kts_34_ne": 120.0,"kts_34_se": 120.0,"kts_34_sw": 120.0,"kts_34_nw": 120.0,"kts_50_ne": 30.0,"kts_50_se": 30.0,"kts_50_sw": 30.0,"kts_50_nw": 30.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 80.42597486457502,"storm_category_id": 61,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39660,"storm_path_id": 5191,"id_index": 5,"lat": -27.272192190703755,"lon": 106.43135565273265,"date_utc": "2025-01-22T06:00:00","time_utc": "2025-01-22T06:00:00","heading": 184.97987528446774,"speed_kts": 5.87,"max_wind_speed": 60.0,"max_gust": 75.0,"central_pressure": 968.0,"output_unit_id": 24,"kts_34_ne": 140.0,"kts_34_se": 140.0,"kts_34_sw": 140.0,"kts_34_nw": 140.0,"kts_50_ne": 40.0,"kts_50_se": 40.0,"kts_50_sw": 40.0,"kts_50_nw": 40.0,"kts_64_ne": 0.0,"kts_64_se": 0.0,"kts_64_sw": 0.0,"kts_64_nw": 0.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 70.49937770872552,"storm_category_id": 61,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39659,"storm_path_id": 5191,"id_index": 4,"lat": -25.839783292388578,"lon": 106.91805649682718,"date_utc": "2025-01-21T18:00:00","time_utc": "2025-01-21T18:00:00","heading": 199.79920102460153,"speed_kts": 8.08,"max_wind_speed": 70.0,"max_gust": 85.0,"central_pressure": 964.0,"output_unit_id": 24,"kts_34_ne": 150.0,"kts_34_se": 150.0,"kts_34_sw": 150.0,"kts_34_nw": 150.0,"kts_50_ne": 55.0,"kts_50_se": 55.0,"kts_50_sw": 55.0,"kts_50_nw": 55.0,"kts_64_ne": 30.0,"kts_64_se": 30.0,"kts_64_sw": 30.0,"kts_64_nw": 30.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 96.995325785958,"storm_category_id": 56,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39658,"storm_path_id": 5191,"id_index": 3,"lat": -24.372342598703746,"lon": 107.86572614548885,"date_utc": "2025-01-21T06:00:00","time_utc": "2025-01-21T06:00:00","heading": 213.58172834198302,"speed_kts": 8.71,"max_wind_speed": 80.0,"max_gust": 100.0,"central_pressure": 954.0,"output_unit_id": 24,"kts_34_ne": 160.0,"kts_34_se": 160.0,"kts_34_sw": 160.0,"kts_34_nw": 160.0,"kts_50_ne": 65.0,"kts_50_se": 65.0,"kts_50_sw": 65.0,"kts_50_nw": 65.0,"kts_64_ne": 35.0,"kts_64_se": 35.0,"kts_64_sw": 35.0,"kts_64_nw": 35.0,"kts_80_ne": 10.0,"kts_80_se": 10.0,"kts_80_sw": 10.0,"kts_80_nw": 10.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 104.49994695263722,"storm_category_id": 56,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39652,"storm_path_id": 5191,"id_index": 2,"lat": -23.146729614144647,"lon": 109.49619483891335,"date_utc": "2025-01-20T18:00:00","time_utc": "2025-01-20T18:00:00","heading": 235.44514106127625,"speed_kts": 10.14,"max_wind_speed": 90.0,"max_gust": 110.0,"central_pressure": 954.0,"output_unit_id": 24,"kts_34_ne": 160.0,"kts_34_se": 160.0,"kts_34_sw": 160.0,"kts_34_nw": 160.0,"kts_50_ne": 65.0,"kts_50_se": 65.0,"kts_50_sw": 65.0,"kts_50_nw": 65.0,"kts_64_ne": 35.0,"kts_64_se": 35.0,"kts_64_sw": 35.0,"kts_64_nw": 35.0,"kts_80_ne": 10.0,"kts_80_se": 10.0,"kts_80_sw": 10.0,"kts_80_nw": 10.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 121.73330041345008,"storm_category_id": 56,"last_accessed_on": "2025-01-20T06:16:49.691630"},{"storm_path_data_id": 39651,"storm_path_id": 5191,"id_index": 1,"lat": -21.756975740067507,"lon": 111.33857823381689,"date_utc": "2025-01-20T06:00:00","time_utc": "2025-01-20T06:00:00","heading": 229.3774269417623,"speed_kts": 11.3,"max_wind_speed": 85.0,"max_gust": 100.0,"central_pressure": 964.0,"output_unit_id": 24,"kts_34_ne": 160.0,"kts_34_se": 160.0,"kts_34_sw": 160.0,"kts_34_nw": 160.0,"kts_50_ne": 60.0,"kts_50_se": 60.0,"kts_50_sw": 60.0,"kts_50_nw": 60.0,"kts_64_ne": 35.0,"kts_64_se": 35.0,"kts_64_sw": 35.0,"kts_64_nw": 35.0,"kts_80_ne": 0.0,"kts_80_se": 0.0,"kts_80_sw": 0.0,"kts_80_nw": 0.0,"created_by": 18,"created_on": "2025-01-20T14:15:17.582420","updated_by": 18,"updated_on": "2025-01-20T06:17:18.637018","distance_in_miles": 135.55996230516502,"storm_category_id": 56,"last_accessed_on": "2025-01-20T06:16:49.691630"}]],"map_hovers": {"storm_413": {"lat": -34.4,"lon": 111.53000000000004}}}
      
      
      
        setStormDatas(data_storm.storm_datas || []);
      setTrackDatas(data_storm.track_datas || []);
      setMapHovers(data_storm.map_hovers || []);

      setTyphonCoords(
        (data_storm.storm_datas || []).map((datas: any) =>
          datas.map((data: any) => {
            const utcDate = new Date(data.date_utc + "Z");
            const day = utcDate.getUTCDate().toString().padStart(2, "0");
            const time = `${utcDate.getUTCHours().toString().padStart(2, "0")}:${utcDate.getUTCMinutes().toString().padStart(2, "0")}`;
            const formattedDate = `${day}/${time}`;
            
            const rotation = data.lat >= 0 ? "rotate(-360deg)" : "rotate(360deg)";

            const markerElement = document.createElement('img');
            markerElement.src = 
            markerElement.style.height = "30px";
            markerElement.style.transform = rotation; 
            markerElement.className = "rotate-animation";

            return {
              ...data,
              latlng: [data.lon, data.lat],
              info: data.date_utc === undefined ? "-" : `Time UTC: ${formattedDate}`,
              markerElement 
            };
          })
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setStormDatas([]);
      setTrackDatas([]);
      setMapHovers([]);
      setTyphonCoords([]);
    }
  };
  fetchData();
}, [setStormDatas, setTrackDatas]);
  
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState<number>(4);

  const userCircleRadius = [
    "warning_radius1_frequency",
    "warning_radius2_frequency",
    "warning_radius3_frequency",
  ];
  const userCircleColors: any = {
    warning_radius1_frequency: "green",
    warning_radius2_frequency: "yellow",
    warning_radius3_frequency: "red",
  };

  const circleRadius = ["kts_34_ne", "kts_50_ne", "kts_64_ne", "kts_80_ne"];
  const circleColors: any = {
    kts_34_ne: "green",
    kts_50_ne: "yellow",
    kts_64_ne: "red",
    kts_80_ne: "black",
  };
  const [activeRadius, setActiveRadius] = useState<string[]>([]);

  useEffect(() => {
    if (!map.current) return;
    showClicle();
  }, [activeRadius, setActiveRadius]);

  function returnCycloneRange(value: number) {
    if (value < 64) {
      return 0;
    } else if (value >= 64 && value <= 82) {
      return 1;
    } else if (value >= 83 && value <= 95) {
      return 2;
    } else if (value >= 96 && value <= 112) {
      return 3;
    } else if (value >= 113 && value < 136) {
      return 4;
    } else if (value >= 157) {
      return 5;
    } else {
      return 0;
    }
  }
  // display circles as per the button click
  const showClicle = () => {
    if (map.current && activeRadius) {
      circleRadius.forEach((radius, rIndex) => {
        TyphonCoords.forEach((datas: any, index: number) =>
          datas.forEach((data: any, index2: number) => {
            const layerId = `circle-fill-${index}-${index2}-${rIndex}`;

            if (map.current!.getLayer(layerId)) {
              const visibility = activeRadius.includes(radius)
                ? "visible"
                : "none";
              map.current!.setLayoutProperty(layerId, "visibility", visibility);
            }
          })
        );
      });
    }
  };

  const lableGeoJSONS = TyphonCoords.map((datas: any) =>
    Object({
      type: "FeatureCollection",
      features: datas.map((item: any, index: number) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: item.latlng,
        },
        properties: {
          title: datas.length - index,
        },
      })),
    })
  );

  const GeoLatLons = TyphonCoords.map((datas: any) =>
    datas.map((item: any) => {
      return item.latlng;
    })
  );

  useEffect(() => {
    const renderMap = async () => {
      if (!mapContainer.current) return;
      try {
        const data = {"project_location": {"latitude": -17.63,"longitude": 106.95235,"route_id": 1265},"cyclone_data": {"forecast_cyclone_id": 3591,"forecast_id": 9529,"report_template_id": 87,"warning_radius1_hour": 12,"warning_radius1_frequency": 1000.0,"warning_radius2_hour": 6,"warning_radius2_frequency": 600.0,"warning_radius3_hour": 3,"warning_radius3_frequency": 300.0,"warning_radius4_hour": null,"warning_radius4_frequency": null,"wind_criteria1": 34.0,"wind_criteria2": 47.0,"wind_criteria3": 60.0,"wave_criteria1": 5.0,"wave_criteria2": 7.0,"wave_criteria3": 9.0,"created_by": 25,"created_on": "2025-01-17T00:55:50.826920","updated_by": 18,"updated_on": "2025-01-20T02:33:34.580346","include_time_to_on_set": true,"warning_radius": null,"warning_radius_unit_id": 24,"reference_time": "2025-01-17T00:40:57.883030","subject": "Tropical Cyclone Warning {storm_name} for QUEST MARINE-OFFSHORE SUPPLIER-27-11748","file_prefix": "TC BULLETIN_{storm_name}-QUEST MARINE-OFFSHORE SUPPLIER-27-11748 {yyyy}-{MM}-{dd} {HH}{mm}","auto_generate_warnings": false,"last_accessed_on": "2025-01-20T02:33:10.225574"}}
       
        setuserGeoCords({
          lat: data.project_location.latitude.toString(),
          lng: data.project_location.longitude.toString(),
        });
        setFetchedDatas(data);
        setWarningData(data.cyclone_data);
  
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v10", 
          center: [data.project_location.longitude, data.project_location.latitude],
          zoom: zoom,
          minZoom: 1.0,
        });
        
        map.current.on('style.load', () => {
          setIsStyleLoaded(true);
  

          if (map.current) {
            map.current.addControl(
              new mapboxgl.NavigationControl({ showCompass: false }),
              "top-right"
            );
            map.current.addControl(new mapboxgl.FullscreenControl());
          }
        });
        
      } catch (error) {
        console.error("Error rendering map:", error);
  
        setuserGeoCords({ lat: "1.290270", lng: "103.851959" });
        setFetchedDatas(null);
      }
    };
  
    renderMap();
  }, []);
  
  
  // render map
  useEffect(() => {
    if (isStyleLoaded) {
      if (map.current) {
        const currentMap = map.current; 
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
          .setLngLat([
            parseFloat(userGeoCords.lng),
            parseFloat(userGeoCords.lat),
          ])
          .addTo(map.current);
      
        let project = localStorage.getItem("project");
      
        let trimmedProject = project ? project.replace(/-\d+(-\d+)*$/, '').trim() : '';
      
        const popup = new mapboxgl.Popup({
          offset: 35,
          closeButton: false,
          closeOnClick: false,
        })
          .setHTML(`<b>${trimmedProject}</b>`)
          .setLngLat([
            parseFloat(userGeoCords.lng),
            parseFloat(userGeoCords.lat),
          ])
          .addTo(map.current);
      
        const popupContainer = (popup as any)._content;
        if (popupContainer) {
          popupContainer.style.backgroundColor = "rgba(0, 0, 0, 0)";
          // popupContainer.style.boxShadow = "none";
          // popupContainer.style.border = "1px solid #000";
          // popupContainer.style.color = "#0000FF";
        }
      }
      
      
      if (userGeoCords.lng !== undefined && userGeoCords.lat !== undefined) {
        const userCenter = turf.point([
          parseFloat(userGeoCords.lng),
          parseFloat(userGeoCords.lat),
        ]);


        userCircleRadius.forEach((radius, rIndex) => {
          if (map.current && fetchedDatas && fetchedDatas.cyclone_data) {
            const cycloneData = fetchedDatas.cyclone_data[radius];
            if (cycloneData !== undefined) {
             
              const semiMajorAxis = cycloneData + 150; 
              const semiMinorAxis = cycloneData + 150; 
      
              const ellipseVertices = turf.ellipse(
                userCenter,
                semiMajorAxis,
                semiMinorAxis,
                {
                  units: "kilometers",
                  steps: 64,
                }
              );
        
              const sourceId = `ellipseData-${rIndex}`;
              const fillLayerId = `ellipse-fill-${rIndex}`;
              const strokeLayerId = `ellipse-stroke-${rIndex}`;
              const labelLayerId = `ellipse-label-${rIndex}`;
        
              map.current.addSource(sourceId, {
                type: "geojson",
                data: ellipseVertices,
              });
        
              // map.current.addLayer({
              //   id: fillLayerId,
              //   type: "fill",
              //   source: sourceId,
              //   paint: {
              //     "fill-color": userCircleColors[radius],
              //     "fill-opacity": 0.2,
              //   },
              // });
        
              map.current.addLayer({
                id: strokeLayerId,
                type: "line",
                source: sourceId,
                paint: {
                  "line-color": userCircleColors[radius],
                  "line-width": 2,
                },
              });
        
              
              const labelCoordinates = ellipseVertices.geometry.coordinates[0][32]; 
        
              const labelGeoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: labelCoordinates as [number, number], 
                    },
                    properties: {
                      label: cycloneData.toString(),
                    },
                  },
                ],
              };
              
              map.current.addSource(`labelData-${rIndex}`, {
                type: "geojson",
                data: labelGeoJson, 
              });
              
        
              map.current.addLayer({
                id: `labelLayer-${rIndex}`,
                type: "symbol",
                source: `labelData-${rIndex}`,
                layout: {
                  "text-field": "{label}", 
                  "text-size": [
                    "interpolate", 
                    ["linear"],
                    ["zoom"],
                    5, 
                    10, 
                    10, 
                    24, 
                  ],
                  "text-offset": [0, 2.5], 
                  "text-anchor": "bottom", 
                  "text-justify": "center", 
                },
                paint: {
                  "text-color": "#000000", 
                },
              });
              
            }
          }
        });
      }
        

      stormDatas.map((datas: any) =>
        datas.map((data: any) => {
          if (map.current && data.storm_category_id === 54) {
            const marker = new mapboxgl.Marker()
              .setLngLat([parseFloat(data.lon), parseFloat(data.lat)])
              .addTo(map.current);
            let project = localStorage.getItem("project");
 
            let trimmedProject = project ? (project.match(/^[^\d]+/)?.[0].trim() || '') : '';
      
            new mapboxgl.Popup({
              offset: 35,
              closeButton: false,
              closeOnClick: false,
            })
              .setHTML(`<b>${trimmedProject}</b>`) 
              .setLngLat([parseFloat(data.lon), parseFloat(data.lat)])
              .addTo(map.current);
          }
        })
      );
      
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
          })),
        };
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
              "text-offset": [0, 2],
              "text-anchor": "right",
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, 
                5,
                10,
                15,
                15, 
                20,
              ],
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
          const userDistance = calculateDistanceNauticalMiles(
            parseFloat(userGeoCords.lat),
            parseFloat(userGeoCords.lng),
            parseFloat(item.latlng[1]),
            parseFloat(item.latlng[0])
          );
        
          const cyclone_range_icon = returnCycloneRange(
            item.speed_kts !== undefined && item.distance !== undefined
              ? 0
              : item.max_wind_speed !== undefined
              ? item.max_wind_speed
              : item.speed_kts
          );
        
          const latValue = parseFloat(item.latlng[1]);
      
          const iconSet = latValue >= 0 ? typhon_icon : typhon_icon_new;
      
          markerElement.src =
            new Date(item.date_utc).toLocaleDateString() === new Date().toLocaleDateString() ||
            new Date(item.date_utc) >= new Date()
              ? iconSet[cyclone_range_icon]  
              : typhon_icon_g[cyclone_range_icon];  
        
          markerElement.style.height = "30px";
        
          
          

          if (map.current) {
            const tableHeader = [
              "Index",
              "Storm Date Time (UTC)",
              "Position",
              "Distance (nm)",
              "System Speed (kn)",
              "Pressure (hPa)",
              "Max Wind (kn)",
              "34-knot radius",
              "50-knot radius",
              "64-knot radius",
              "80-knot radius",
            ];

            const tableHTML = `
         <div id="demo">
  <div class="popup-table right-popup">
    <table>
      <thead>
        <tr>
          ${tableHeader
            .map((head) => `<td><strong>${head}</strong></td>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${main_datas
          .map((typhoon: any, index: number) => {
            const distanceToUser = Math.round(
              calculateDistanceNauticalMiles(
                parseFloat(userGeoCords.lat),
                parseFloat(userGeoCords.lng),
                parseFloat(typhoon.latlng[1]),
                parseFloat(typhoon.latlng[0])
              )
            );
            

            const correspondingTyphoon = main_datas[index];
            const utcDate = new Date(correspondingTyphoon.date_utc + "Z");
            const day = utcDate
              .getUTCDate()
              .toString()
              .padStart(2, "0");
            const time = `${utcDate
              .getUTCHours()
              .toString()
              .padStart(2, "0")}:${utcDate
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}`;
            const formattedDate = `${day}/${time}`;

            return `
              <tr>
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
               <td>${Math.round(correspondingTyphoon.lat * 10) / 10}N ${
              Math.round(correspondingTyphoon.lon * 10) / 10
            }E</td>

                <td>${distanceToUser}</td>
                <td>${correspondingTyphoon.speed_kts.toFixed(2)}</td>
                <td>${correspondingTyphoon.central_pressure}</td>
                <td>${correspondingTyphoon.max_wind_speed}</td>
                <td>${correspondingTyphoon.kts_34_ne}</td>
                <td>${correspondingTyphoon.kts_50_ne}</td>
                <td>${correspondingTyphoon.kts_64_ne}</td>
                <td>${correspondingTyphoon.kts_80_ne}</td>
              </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  </div>
</div>`;


            const popup = new mapboxgl.Popup({
              offset: 25,
              maxWidth: "fit-content",
              anchor: "bottom-left",
              className: "popup-main-table",
            }).setHTML(tableHTML);

            new mapboxgl.Marker({
              element: markerElement,
            })
              .setLngLat(item.latlng)
              .addTo(map.current)
              .setPopup(popup);

            const popupContent = `
<center>
                  ${item.info}<br> Distance:
                   ${userDistance.toFixed(0)} nm<br>

                  ${
                    item.max_wind_speed !== undefined
                      ? `Wind Speed: ${item.max_wind_speed} kn<br>`
                      : ""
                  }
                  ${
                    item.speed_kts !== undefined &&
                    item.distance_in_miles !== undefined
                      ? `Movement: ${item.speed_kts.toFixed(
                          0
                        )} kn<br> Direction: ${coronical(
                          item.distance_in_miles.toFixed(2)
                        )} / 0${Math.floor(item.speed_kts)} kn<br>`
                      : "-"
                  }
                  Central Pressure: ${item.central_pressure} hPa<br>
</center>`;

            new mapboxgl.Popup({
              offset: 10,
              closeButton: false,
              closeOnClick: false,
              anchor: "bottom",
              className: "hover-over",
            })
              .setHTML(popupContent)
              .setLngLat(item.latlng)
              .addTo(map.current);
          }

          // Inside your useEffect where you add sources
          circleRadius.forEach((radius, rIndex) => {
            if (map.current) {
              const sourceId = `circleData-${main_index}-${index}-${rIndex}`;

              if (map.current.getSource(sourceId)) {
                map.current.removeSource(sourceId);
              }

              let _center = turf.point(item.latlng);
              let _options = {
                steps: 80,
                units: "kilometers" as "kilometers",
              };
              let _circle = turf.circle(
                _center,
                item === undefined || item[radius] === undefined
                  ? 0
                  : item[radius],
                _options
              );
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
  }, [isStyleLoaded, fetchedDatas, map, stormDatas]);

  function btnClick(circle: any) {
    setActiveRadius([circle]);
    setBtnColor({
      background: circleColors[circle],
      color: "white",
      border: "0px solid",
      width: "20px",
    });
  }


  

  function resetClick(circle: any) {
    setActiveRadius(circle);
    setBtnColor({
      background: "white",
      color: "black",
      border: "0px solid",
      width: "20px",
    });
  }
  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <div className="sidebar">
        <div className={["sidebar-mode", "icon-menu"].join(" ")}>
          <button
            onClick={() => {
              if (popupbar.current !== null) {
              }
            }}
            className="mode-button"
          ></button>
          <button
            onClick={() => {
              if (popupbar.current !== null) {
              }
            }}
            className="mode-button"
          ></button>
        </div>
        <div className="sidebar-mode">
          {circleRadius.slice(0, 4).map((circle) => (
            <button
              key={circle}
              style={
                activeRadius[0] === circle
                  ? btncolor
                  : {
                      background: "white",
                      color: "black",
                      border: "0px solid",
                      width: "20px",
                    }
              }
              className={[
                "radius-btn",
                activeRadius.length === 1 && activeRadius[0] === circle
                  ? "active-button"
                  : "",
              ].join(" ")}
              onClick={() => btnClick(circle)}
            >
              {circle.split("_")[1]}
            </button>
          ))}
          <button
            style={{
              background: "white",
              color: "black",
              border: "0px solid",
              width: "20px",
            }}
            className={[
              "radius-btn",
              activeRadius.length !== 1 ? "active-button" : "",
            ].join(" ")}
            onClick={() => resetClick(circleRadius)}
          >
            All
          </button>
        </div>
      </div>
      <div ref={popupbar} className="bottom-bar-popup">
  {[
    { storm_track_id: 1, storm_name: "Storm Alpha" },
    { storm_track_id: 2, storm_name: "Storm Beta" },
    { storm_track_id: 3, storm_name: "Storm Gamma" },
  ].map((data: any) => (
    <span key={data.storm_track_id} className="bottom-bar-box">
      <span
        onClick={() => {
          if (map.current === null) return;
          map.current.setCenter([0, 0]); // Example coordinates for testing
        }}
      >
        {data.storm_name}
      </span>
      <Button
        variant="contained"
        color="primary"
        onClick={() => alert(`Downloading PDF for ${data.storm_name}`)}
        disabled={false} // Keep enabled for testing
        startIcon={<CircularProgress size={20} />}
      >
        Download PDF
      </Button>
    </span>
  ))}
</div>

      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
