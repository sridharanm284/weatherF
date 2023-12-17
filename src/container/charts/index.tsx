import React, { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import store from "../../store";
import { useSelector } from "react-redux";
import "./_index.scss";
import WeatherLoader from "../../components/loader";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import leaflet from "leaflet";
import L, { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
//import markerIconUrl from "../../assets/vectos/pin.png";

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

const ChartComponent: React.FC = () => {
  const data = useSelector((state: any) => state?.app);
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [dir, setDir] = useState<any>({});
  const [loading, setLoading] = useState<any>(true);

  const [newPlace, setNewPlace] = useState<any>(null);

  useEffect(() => {
    const getLatLon = async () => {
      const response = await fetch(
        `http://localhost:8000/api/getlatlon/${localStorage.getItem("fid")}/`
      );
      const data = await response.json();
      setDir(data);
      setLoading(false);
    };
    getLatLon();
  }, [setDir]);

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

  const zoomLevel = 6;
  let circleAdjusment = 0.00001;

  //const markericon: Icon = new L.Icon({
   // iconUrl: markerIconUrl,
  //  iconSize: [35, 45],
  //  iconAnchor: [17, 46],
  //  popupAnchor: [0, -46],
 // });

  const imageIcon = new leaflet.DivIcon({
    className: "my-custom-icon", // Optional, can style in CSs
    iconSize: [50, 50],
  });

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap page-forecast">
          {loading ? (
            <div className={"loader-div"}>
              <WeatherLoader />
            </div>
          ) : (
            <MapContainer
              center={[
                dir.lat === null || dir.lat === undefined ? 1.29027 : dir.lat,
                dir.lon === null || dir.lon === undefined
                  ? 103.851959
                  : dir.lat,
              ]}
              zoom={zoomLevel}
              style={{ height: "92vh", width: "100%" }}
            >
              <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=J29SAQ3WMJYbKAw4j5AC" />
              {((dir.lat !== undefined) && (dir.lon !== undefined) && (dir.lat !== "") && (dir.lon !== "")) && (
                <>
                  <Marker
                    position={[
                      dir.lat === null || dir.lat === undefined
                        ? 1.29027
                        : dir.lat,
                      dir.lon === null || dir.lon === undefined
                        ? 103.851959
                        : dir.lat,
                    ]}
                    //icon={markericon}
                  >
                    <Popup>⛅</Popup>
                  </Marker>
                  {(dir.a_10mwindspeed !== null ||
                    dir.a_10mwindspeed !== undefined) && (
                    <>
                      <Circle
                        center={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        pathOptions={{ color: "green" }}
                        radius={dir.a_10mwindspeed * 10000}
                      ></Circle>
                      <Marker
                        position={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        icon={imageIcon}
                      />
                    </>
                  )}

                  {(dir.a_50mwindspeed !== null ||
                    dir.a_50mwindspeed !== undefined) && (
                    <>
                      <Circle
                        center={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        pathOptions={{ color: "blue" }}
                        radius={
                          (dir.a_50mwindspeed === null ||
                          dir.a_50mwindspeed === undefined
                            ? 10
                            : dir.a_50mwindspeed) * 10000
                        }
                      ></Circle>
                      <Marker
                        position={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        icon={imageIcon}
                      />
                    </>
                  )}

                  {(dir.a_100mwindspeed !== null ||
                    dir.a_100mwindspeed !== undefined) && (
                    <>
                      <Circle
                        center={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        pathOptions={{ color: "red" }}
                        radius={
                          (dir.a_100mwindspeed === null ||
                          dir.a_100mwindspeed === undefined
                            ? 10
                            : dir.a_100mwindspeed) * 10000
                        }
                      >
                        {" "}
                      </Circle>
                      <Marker
                        position={[
                          (dir.lat === null || dir.lat === undefined
                            ? 1.29027
                            : dir.lat) - circleAdjusment,
                          (dir.lon === null || dir.lon === undefined
                            ? 103.851959
                            : dir.lat) + circleAdjusment,
                        ]}
                        icon={imageIcon}
                      />
                    </>
                  )}
                </>
              )}
            </MapContainer>
          )}
        </div>
      </Box>
    </div>
  );
};

export default ChartComponent;
