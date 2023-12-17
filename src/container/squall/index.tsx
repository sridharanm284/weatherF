import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";

import store from "../../store";
import "./styles/_index.scss";

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

const Squall = () => {
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [hideShareButton, setHideShareButton] = useState(false);
  const data = useSelector((state: any) => state?.app);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  const videoFileName: string = process.env.PUBLIC_URL + "/" + "weather.mp4";

  useEffect(() => {
    console.log("Video file path:", videoFileName);
  }, [videoFileName]);

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

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
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
                <video
                  ref={videoRef}
                  controls
                  style={{
                    width: "100%",
                    height: "80%",
                  }}
                >
                  <source src={videoFileName} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div>
                  <button onClick={handlePlayPause}>Play/Pause</button>
                  <button onClick={() => handleSeek(-5)}>Rewind 5s</button>
                  <button onClick={() => handleSeek(5)}>Forward 5s</button>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Squall;