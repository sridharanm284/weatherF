import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import store from "../../store";
import "./_index.scss";
import CloseIcon from "@mui/icons-material/Close";
import WeatherLoader from "../../components/loader";
import axios from "axios";
 
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
 controls
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
 
  const [init, setInit] = useState<any>();
  const [storm, setStorm] = useState<any>();
  const [intensity, setIntensity] = useState<any>();
  const [fc, setFc] = useState<any>();
  const mapWidth = 600; // Replace with your map width
  const mapHeight = 600; // Replace with your map height
  const [loading, setLoading] = useState(true);
  const [pinDiff, setPinDiff] = useState<any>();
  const [svgVisible, setSvgVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
   const [apiUrl, setApiUrl] = useState<string | null>(null);
   const [imageData, setImageData] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_IP}api/getcsv/${localStorage.fid}`
        );
        if (response.status === 404) {
          setTitle("No squall warnings are currently active");
        } else {
          const csvText = response.data;
          setJsonData(csvText);
          setTitle(csvText[0]["Squall Header"]);
          setDesc(csvText[0]["Squall Advisory"]);
          setSquallMap(csvText[0]["SatImgSection"]);
          setUserLat(csvText[0]["Client's lat"]);
          setUserLon(csvText[0]["Client's lon"]);
          setCurLat(csvText[0]["Previous Sat lat"]);
          setCurLon(csvText[0]["Previous Sat lon"]);
          setPrevLat(csvText[0]["Latest Sat lat"]);
          setPrevLon(csvText[0]["Latest Sat lon"]);
          setInit(csvText[0]["Initial Heading"]);
          setStorm(csvText[0]["Storm Speed"]);
          setIntensity(csvText[0]["Squall Intensity"]);
          setFc(csvText[0]["Forecaster"]);
        }
      } catch (error: any) {
        setError(error.message || "An error occurred while fetching data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCroppedImage = async () => {

      const projectName = 'PT MIFA BERSAUDARA-OFFSHORE POINT';
  
      try {

        const response = await fetch('http://127.0.0.1:8000/converter/crop_pdf/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ project_name: projectName }).toString(),
        });
  
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageData(imageUrl);
        } else {
          console.error(`Error fetching cropped image: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchCroppedImage();
  }, []);
  
 
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
        if (fid && SquallMap) {  
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_IP}api/getvideo/${fid}/${SquallMap}/`,
            { responseType: "blob" }
          );
          const url = URL.createObjectURL(response.data);
          setVideoUrl(url);
        } else {
          console.error('Either fid or SquallMap is not available');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideo();
   }, [SquallMap, setVideoUrl]);
 
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
                {(title || desc) ? (
  <div className="titleBox">
    {title && <div className="title">{title}</div>}
    {desc && (
      <div className="description">
        <p>{desc}</p>
      </div>
    )}
  </div>
) : (
  <div className="noData">There are currently no severe warnings active for this location</div>
)}

 
<div className="map" style={{ overflowX: 'auto' }}>
      {imageData ? (
        <img
          src={imageData}
          alt="Cropped PDF"
          style={{ maxWidth: '50%', height: '50%' }}
        />
      ) : (
        <p></p>
      )}
    </div>
                  {(init || storm || intensity || fc) && (
  <div className="tableBox margin-tableBox">
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
          <td className="sqtd">{init ? Math.floor(init) : "-"}</td>
          <td className="sqtd">{storm ? Math.floor(storm) : "-"}</td>
          <td className="sqtd">{intensity ? intensity : "-"}</td>
          <td className="sqtd">{fc ? fc : "-"}</td>
        </tr>
      </tbody>
    </table>
  </div>
)}

{(localStorage.getItem("project") && render()) ? (
  <div className="tableBox margin-tableBox">
    <table className="table">
      <thead className="tableheader">
        <tr className="sqtr">
          <th className="sqth">Date/Time</th>
          <th className="sqth" colSpan={2}>Position</th>
          <th className="sqth">Time to</th>
          <th className="sqth">Distance to</th>
        </tr>
        <tr className="sqtr">
          <th className="sqth">UTC+8</th>
          <th className="sqth">LAT.</th>
          <th className="sqth">LONG.</th>
          <th className="sqth">
  {(() => {
    const project = localStorage.getItem("project");
    return project
      ? project.split("-").slice(0, 2).join("-")
      : "No project";
  })()}
</th>

<th className="sqth">
  {(() => {
    const project = localStorage.getItem("project");
    return project
      ? project.split("-").slice(0, 2).join("-")
      : "No project";
  })()}
</th>

        </tr>
      </thead>
      <tbody className="tablebody">{render()}</tbody>
    </table>
  </div>
) : null}

<div className="button">
  {data && data.length > 0 && (
    <button id="file" onClick={() => setFile((prev: boolean) => !prev)}>
      MP4 animation (large)
    </button>
  )}
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