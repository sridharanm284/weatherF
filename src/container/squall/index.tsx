import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import store from "../../store";
import "./_index.scss";
import CloseIcon from "@mui/icons-material/Close";
import section from "./section";
import degree from "./degree";
import WeatherLoader from "../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faBackward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Bearing, Posdist, NewPosLat, NewPosLon } from './calculations'; 

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
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
interface ImageModalProps {
  onClose: () => void;
  VideoUrl: any;
}
interface GifModalProps {
  onClose: () => void;
  SquallMap: any;
}

const ImageModal: React.FC<ImageModalProps> = ({ onClose, VideoUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };
  return (
    <div
      className="modal-overlay"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "800px",
          margin: "20vh auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <button
          className="close-button"
          onClick={onClose}
          style={{
            color: "#333",
            cursor: "pointer",
            position: "absolute",
            top: "-20px",
            right: "-20px",
            backgroundColor: "#fff",
            border: "none",
            fontSize: "1.5rem",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          &times;
        </button>
        <video
          ref={videoRef}
          src={VideoUrl}
          style={{
            maxWidth: "100%",
            maxHeight: "60vh",
            width: "auto",
            display: "block",
            margin: "0 auto",
          }}
        >
          Your browser does not support the video tag.
        </video>
        <div
          className="controls-container"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <button className="control-button" onClick={handlePlayPause}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <div style={{ width: "10px" }}></div>
          <button className="control-button" onClick={() => handleSeek(-5)}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <div style={{ width: "10px" }}></div>
          <button className="control-button" onClick={() => handleSeek(5)}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      </div>
    </div>
  );
};
const GifModal: React.FC<GifModalProps> = ({ onClose, SquallMap }) => {
  return (
    <div
      className="modal-overlay"
      style={{ background: "rgb(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div className="modal-content" style={{ display: "flex" }}>
        <img
          src={`${process.env.REACT_APP_BACKEND_IP}api/getgif/${SquallMap}`}
          width={100}
          alt="GIF"
        />
        <CloseIcon
          onClick={() => onClose()}
          style={{ color: "white", cursor: "pointer", paddingLeft: "20px" }}
          fontSize="medium"
        />
      </div>
    </div>
  );
};
const Squall = () => {
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);
  const [gif, setGif] = useState(false);
  const [file, setFile] = useState(false);
  const [jsonData, setJsonData] = useState<any>();
  const [error, setError] = useState();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [SquallMap, setSquallMap] = useState("");
  const [userLat, setUserLat] = useState(0);
  const [userLon, setUserLon] = useState(0);
  const [PrevLat, setPrevLat] = useState(0);
  const [PrevLon, setPrevLon] = useState(0);
  const [CurLat, setCurLat] = useState(0);
  const [CurLon, setCurLon] = useState(0);
  // const [pinx, setPinX] = useState<any>();
  // const [piny, setPinY] = useState<any>();
  // const [pinPx, setPinPx] = useState<any>();
  // const [pinPy, setPinPy] = useState<any>();
  // const [pinCx, setPinCx] = useState<any>();
  // const [pinCy, setPinCy] = useState<any>();
  const [init, setInit] = useState<any>();
  const [storm, setStorm] = useState<any>();
  const [intensity, setIntensity] = useState<any>();
  const [fc, setFc] = useState<any>();
  const mapWidth = 600; // Replace with your map width
  const mapHeight = 600; // Replace with your map height
  const [loading, setLoading] = useState(true);
  // const [pinDiff, setPinDiff] = useState<any>();
  const [svgVisible, setSvgVisible] = useState(false);
  // const [imageLoaded, setImageLoaded] = useState(false);



  const [pinX, setPinX] = useState(0);
  const [pinY, setPinY] = useState(0);
  const [pinCx, setPinCx] = useState(0);
  const [pinCy, setPinCy] = useState(0);
  const [pinPx, setPinPx] = useState(0);
  const [pinPy, setPinPy] = useState(0);
  const [pinDiff, setPinDiff] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);



  useEffect(() => {
    const fetchData = () => {
      try {
        const data = [
          {
              "Forecast ID (from Metsys)": "6587",
              "Client's Name": "SOC",
              "Site/Vessel name": "OWF HL2",
              "Client's lat": "23.998",
              "Client's lon": "119.86",
              "Squall Header": "Severe Weather Warning for OWF HL2 issued at 30 Jul 2024 16:29 UTC+8",
              "Squall Advisory": "Latest satellite imagery shows convective activities over land moves westward to affect your site. There is a MODERATE to HIGH risk of squalls around 20-35 knots in/near heavy thunderstorms with risk of lightning and rough seas temporarily higher than forecast over the next 3-5 hours. ",
              "Previous Sat lat": "23.9",
              "Previous Sat lon": "120.3",
              "Previous Sat Time (UTC)": "30/07/2024 07:40:00",
              "Latest Sat lat": "24",
              "Latest Sat lon": "120",
              "Latest Sat Time (UTC)": "30/07/2024 08:20:00",
              "SatImgSection": "section-157",
              "Initial Heading": "290.099639669428",
              "Storm Speed": "26.2653769693281",
              "Squall Intensity": "20-35 kn",
              "Forecaster": "",
              "Date/Time Forecast": "30/07/2024 16:28:59",
              "Position lat": "24.0224705819027",
              "Position lon": "119.93270950743",
              "Time to Site (hr)": "-8.56741602809106",
              "Distance to Site (nm)": "3.76255145326213"
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "30/07/2024 16:52:59",
              "Position lat": "24.0825399216395",
              "Position lon": "119.75259256362",
              "Time to Site (hr)": "0",
              "Distance to Site (nm)": "0"
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "30/07/2024 21:52:59",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "ALL CLEAR",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          },
          {
              "Forecast ID (from Metsys)": "",
              "Client's Name": "",
              "Site/Vessel name": "",
              "Client's lat": "",
              "Client's lon": "",
              "Squall Header": "",
              "Squall Advisory": "",
              "Previous Sat lat": "",
              "Previous Sat lon": "",
              "Previous Sat Time (UTC)": "",
              "Latest Sat lat": "",
              "Latest Sat lon": "",
              "Latest Sat Time (UTC)": "",
              "SatImgSection": "",
              "Initial Heading": "",
              "Storm Speed": "",
              "Squall Intensity": "",
              "Forecaster": "",
              "Date/Time Forecast": "",
              "Position lat": "",
              "Position lon": "",
              "Time to Site (hr)": "",
              "Distance to Site (nm)": ""
          }
      ];
        setJsonData(data);

        const firstRecord = data[0];
        setTitle(firstRecord["Squall Header"]);
        setDesc(firstRecord["Squall Advisory"]);
        setSquallMap(firstRecord["SatImgSection"]);
        setUserLat(parseFloat(firstRecord["Client's lat"]));
        setUserLon(parseFloat(firstRecord["Client's lon"]));
        setCurLat(parseFloat(firstRecord["Previous Sat lat"]));
        setCurLon(parseFloat(firstRecord["Previous Sat lon"]));
        setPrevLat(parseFloat(firstRecord["Latest Sat lat"]));
        setPrevLon(parseFloat(firstRecord["Latest Sat lon"]));
        setInit(parseFloat(firstRecord["Initial Heading"]));
        setStorm(parseFloat(firstRecord["Storm Speed"]));
        setIntensity(firstRecord["Squall Intensity"]);
        setFc(firstRecord["Forecaster"]);
      } catch (error) {
 
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    console.log('pinX:', pinX, 'pinY:', pinY);
    console.log('pinCx:', pinCx, 'pinCy:', pinCy);
    console.log('pinPx:', pinPx, 'pinPy:', pinPy);
  }, [pinX, pinY, pinCx, pinCy, pinPx, pinPy]);
  

  // useEffect(() => {
  //   var index = section.indexOf(SquallMap);
  //   var north = degree[index * 4 + 0];
  //   var south = degree[index * 4 + 1];
  //   var west = degree[index * 4 + 2];
  //   var east = degree[index * 4 + 3];
  //   let latRange = north - south;
  //   let lonRange = west - east;
  //   let pixel_x = 600;
  //   let pixel_y = 600;
  //   setPinX((prev: any) => ((userLon - west) / 10) * pixel_x);
  //   setPinY((prev: any) => ((north - userLat) / 10) * pixel_y);
  //   setPinCx((prev: any) => ((CurLon - west) / 10) * pixel_x);
  //   setPinCy((prev: any) => ((north - CurLat) / 10) * pixel_y);
  //   setPinPx((prev: any) => ((PrevLon - west) / 10) * pixel_x);
  //   setPinPy((prev: any) => ((north - PrevLat) / 10) * pixel_y);
  // }, [CurLat, CurLon, PrevLat, PrevLon, SquallMap, userLat, userLon]);

  const closeModalVideo = () => {
    setFile(false);
  };
  const closeModalGif = () => {
    setGif(false);
  };
  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const fid = localStorage.getItem('fid'); 
        if (fid) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_IP}api/getvideo/${fid}/${SquallMap}/`, 
            { responseType: "blob" }
          );
          const url = URL.createObjectURL(response.data);
          setVideoUrl(url);
        } else {
          console.error('fid not found in local storage');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideo();
  }, [setVideoUrl]);
  

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  });

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);
  useEffect(() => {}, [CurLat, CurLon, PrevLat, PrevLon, userLat, userLon]);

  function render() {
    if (!jsonData || !Array.isArray(jsonData)) return null;
  
    return jsonData.map((elem: any, index: number) => {
      if (elem[`Date/Time Forecast`] === "") {
        return null;
      } else if (elem[`Position lat`] === "ALL CLEAR") {
        return (
          <tr key={index} className="sqtr">
            <td className="sqtd">No Squall</td>
            <td className="sqtd">-</td>
            <td className="sqtd">-</td>
            <td className="sqtd">-</td>
            <td className="sqtd">-</td>
          </tr>
        );
      } else {
  
        const formattedDateTime = elem[`Date/Time Forecast`]
          .slice(0, 3) + 
          elem[`Date/Time Forecast`].slice(10, 16); 
    
        const positionLat = isNaN(parseFloat(elem[`Position lat`]))
          ? elem[`Position lat`]
          : parseFloat(elem[`Position lat`]).toFixed(1) + " N"; 
        const positionLon = isNaN(parseFloat(elem[`Position lon`]))
          ? elem[`Position lon`]
          : parseFloat(elem[`Position lon`]).toFixed(1) + " E"; 
        const timeToSiteInHours = parseFloat(elem[`Time to Site (hr)`]);
        let timeToSite;
        if (isNaN(timeToSiteInHours)) {
          timeToSite = elem[`Time to Site (hr)`];
        } else {
          const hours = Math.floor(timeToSiteInHours);
          const minutes = Math.round((timeToSiteInHours - hours) * 60);
          timeToSite = hours > 0 
            ? `${hours}hr ${minutes}min`
            : `${minutes}min`;
        }

        const distanceToSite = isNaN(parseFloat(elem[`Distance to Site (nm)`]))
          ? elem[`Distance to Site (nm)`]
          : Math.round(parseFloat(elem[`Distance to Site (nm)`])) + "NM";
  
        return (
          <tr key={index} className="sqtr">
            <td className="sqtd">{formattedDateTime}</td>
            <td className="sqtd">{positionLat}</td>
            <td className="sqtd">{positionLon}</td>
            <td className="sqtd">{timeToSite}</td>
            <td className="sqtd">{distanceToSite}</td>
          </tr>
        );
      }
    });
  }
  
  

  // useEffect(() => {
  //   let slope = (pinCy - pinPy) / (pinCx - pinPx);
  //   let y = pinPy + slope * (pinx - pinPx);
  //   setPinDiff(y);
  // }, [pinPy, pinCy, pinx, piny, pinPx, pinCx]);

  const handleImageLoad = () => {
    setSvgVisible(true);
  };

  const handleImageLoad1 = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (SquallMap) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_IP}api/getimg/${SquallMap}`, {
          responseType: "blob",
        })
        .then((response) => {
          if (response.status === 200) {
            setImageLoaded(true);
          } else {
            throw new Error("Network response was not ok.");
          }
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [SquallMap]);


  useEffect(() => {
    const index = section.indexOf(SquallMap);
    const north = degree[index * 4 + 0];
    const south = degree[index * 4 + 1];
    const west = degree[index * 4 + 2];
    const east = degree[index * 4 + 3];
    
    const latRange = north - south;
    const lonRange = west - east;
    const pixel_x = 600;
    const pixel_y = 600;

    // Calculate pin positions using your existing logic
    setPinX(((userLon - west) / lonRange) * pixel_x);
    setPinY(((north - userLat) / latRange) * pixel_y);
    setPinCx(((CurLon - west) / lonRange) * pixel_x);
    setPinCy(((north - CurLat) / latRange) * pixel_y);
    setPinPx(((PrevLon - west) / lonRange) * pixel_x);
    setPinPy(((north - PrevLat) / latRange) * pixel_y);
  }, [CurLat, CurLon, PrevLat, PrevLon, SquallMap, userLat, userLon]);

  useEffect(() => {
    // Calculate bearing and update pinDiff
    const bearing = Bearing(CurLat, CurLon, PrevLat, PrevLon);
    const distance = Posdist(CurLat, CurLon, PrevLat, PrevLon);
    const newLat = NewPosLat(CurLat, CurLon, bearing, distance);
    const newLon = NewPosLon(CurLat, CurLon, bearing, distance);

    let slope = (pinCy - pinPy) / (pinCx - pinPx);
    let y = pinPy + slope * (pinX - pinPx);
    setPinDiff(y);
  }, [pinPy, pinCy, pinX, pinY, pinPx, pinCx, CurLat, CurLon, PrevLat, PrevLon]);


  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        {loading ? (
          <div className={"loader-div1"}>
            <WeatherLoader />
          </div>
        ) : (
          <div className="content-wrap page-forecast">
            <div
              className="discussion-content"
              style={{
                marginBottom: -30,
                margin: "16px",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className="titleBox">
                    <div className="title">{title}</div>
                    <div className="description">
                      <p>{desc}</p>
                    </div>
                  </div>

                  <div className="map" style={{ overflowX: "auto" }}>
      <div
        style={{
          position: "relative",
          width: mapWidth,
          height: mapHeight,
        }}
      >
        <img
          src={`${process.env.REACT_APP_BACKEND_IP}converter/getimg/section-144`}
          alt="World Map"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            visibility: svgVisible ? "visible" : "hidden",
          }}
          onLoad={() => {
            handleImageLoad();
          }}
        />
        {imageLoaded && (
          <>
            <div
              style={{
                position: "absolute",
                left: pinX,
                top: pinY,
                width: 10,
                height: 10,
                backgroundColor: "red",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                border: "2px solid red",
                left: pinX - 35,
                top: pinY - 35,
                width: 80,
                height: 80,
                backgroundColor: "transparent",
                borderRadius: "50%",
              }}
            />
            {svgVisible && (
              <svg
                style={{ position: "absolute", left: "2px" }}
                width={mapWidth}
                height={mapHeight}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX=""
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="red" />
                  </marker>
                  <marker
                    id="arrowheadPrev"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L9,3 z" fill="white" />
                  </marker>
                </defs>
                {/* Red line */}
                <path
                  d={`M${pinCx},${pinCy + 5} L${pinX + 5},${pinY + 5}`}
                  fill="none"
                  stroke="red"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead)"
                />
                {/* White line */}
                <path
                  d={`M${pinCx},${pinCy + 5} L${pinPx},${pinPy + 5}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowheadPrev)"
                />
              </svg>
            )}
          </>
        )}
        <div
          style={{
            position: "absolute",
            left: pinPx,
            top: pinPy,
            width: 10,
            height: 10,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: pinCx,
            top: pinCy,
            width: 10,
            height: 10,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>

                  <div className="tableBox  margin-tableBox">
                    <table className="table">
                      <thead className="tableheader">
                        <tr className="sqtr">
                          <th className="sqth">INITIAL HEADING</th>
                          <th className="sqth">STORM SPEED</th>
                          <th className="sqth">SQUALL INTENSITY</th>
                          <th className="sqth">FORECASTER</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        <tr className="sqtr">
                          <td className="sqtd">
                            {init ? Math.floor(init) : "-"}
                          </td>
                          <td className="sqtd">
                            {storm ? Math.floor(storm) : "-"}
                          </td>
                          <td className="sqtd">
                            {intensity ? intensity : "-"}
                          </td>
                          <td className="sqtd">{fc ? fc : "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="tableBox margin-tableBox">
                    <table className="table">
                      <thead className="tableheader">
                        <tr className="sqtr">
                          <th className="sqth">Date/Time</th>
                          <th className="sqth" colSpan={2}>
                            Position
                          </th>
                          <th className="sqth">Time to</th>
                          <th className="sqth">Distance to</th>
                        </tr>
                        <tr className="sqtr">
                          <th className="sqth">UTC+8</th>
                          <th className="sqth">LAT.</th>
                          <th className="sqth">LONG.</th>
                          <th className="sqth">Plant area</th>
                          <th className="sqth">Plant area</th>
                        </tr>
                      </thead>
                      <tbody className="tablebody">{render()}</tbody>
                    </table>
                  </div>
                  <div className="button">
                    <button
                      id="gif"
                      onClick={() => setGif((prev: boolean) => !prev)}
                    >
                      Squall GIF File
                    </button>
                    <button
                      id="file"
                      onClick={() => setFile((prev: boolean) => !prev)}
                    >
                      Squall MP4 File
                    </button>
                  </div>
                  {file && (
                    <ImageModal onClose={closeModalVideo} VideoUrl={videoUrl} />
                  )}
                  {gif && (
                    <GifModal onClose={closeModalGif} SquallMap={SquallMap} />
                  )}
                </Grid>
              </Grid>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};
export default Squall;
