import { useState, useRef, useEffect } from "react";
import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CardPlan from "../../components/dashboard/card";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

const drawerWidth = 0;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
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

export default function DashBoard() {
  // Reference value for current Browser Window Width
  const windowWidth = useRef(window.innerWidth);
  const [stormData, setStormData] = useState([]);
  const [mapHovers, setMapHovers] = useState<any>([]);
  const [loadedDatas, setLoadedDatas] = useState(false);
  // Sets Track about the SideNav Bar Open/Close State
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);
  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  useEffect(() => {
    if (loadedDatas) {
      return;
    }
    fetch(`http://localhost:8000/api/stormdatas/`)
      .then((data) => data.json())
      .then((data) => {
        setStormData(data.track_datas);
        setMapHovers(data.map_hovers);
        setLoadedDatas(true);
      })
      .catch((error) => setLoadedDatas(true));
  });
  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap dashboard">
          <Main open={open} className={"main"}>
            <Grid container spacing={2} display={"flex"} alignItems={"center"}>
              <Grid xs={12} md={9}>
                <Grid container spacing={3}>
                  <CardPlan />
                </Grid>
              </Grid>
              <Grid xs={12} md={3} marginTop={"2em"} height={"63vh"}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "15px",
                  }}
                >
                  <Grid xs={12} sx={{ height: 150 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Active Warnings
                    </Typography>
                  </Grid>
                  <Grid xs={12} sx={{ height: 150 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Squall Warnings
                    </Typography>
                  </Grid>
                  <Grid xs={12} sx={{ height: 150 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Typhoon Warnings
                    </Typography>
                    {((stormData === undefined) ? [] : stormData).map((data: any) =>
                        mapHovers[`storm_${data.storm_track_id}`] !==
                          undefined &&
                        mapHovers[`storm_${data.storm_track_id}`].lon !==
                          undefined && (
                          <Typography
                            key={data.storm_track_id}
                            className={`blink-text-red`}
                            style={{
                              textAlign: "center",
                              paddingBlock: "5px",
                              color: "red",
                            }}
                          >
                            {data.storm_name === undefined
                              ? ""
                              : `${data.storm_name} - ${data.created_on
                                  .split("-")
                                  .slice(1, 3)
                                  .join("/")}`}
                          </Typography>
                        )
                    )}
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Main>
        </div>
      </Box>
    </div>
  );
}
