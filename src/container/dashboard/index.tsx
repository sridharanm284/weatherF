import { useState, useRef, useEffect } from "react";
import "./styles/_index.scss";
import store from "../../store";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import CardPlan from "../../components/dashboard/card";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Box, Grid, Typography, Card } from '@mui/material';

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
  width: '100%', 
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

interface StormTrack {
  storm_track_id: number;
  storm_name: string;
  storm_description: string | null;
  status_id: number;
  created_by: number;
  created_on: string;
  updated_by: number;
  updated_on: string;
  last_accessed_on: string;
}

interface MapHover {
  lat: number;
  lon: number;
}

interface StormData {
  storm_path_data_id: number;
  storm_path_id: number;
  id_index: number;
  lat: number;
  lon: number;
  date_utc: string;
  time_utc: string;
  heading: number;
  speed_kts: number;
  max_wind_speed: number;
  max_gust: number;
  central_pressure: number;
  output_unit_id: number;
  kts_34_ne: number;
  kts_34_se: number;
  kts_34_sw: number;
  kts_34_nw: number;
  kts_50_ne: number;
  kts_50_se: number;
  kts_50_sw: number;
  kts_50_nw: number;
  kts_64_ne: number;
  kts_64_se: number;
  kts_64_sw: number;
  kts_64_nw: number;
  kts_80_ne: number;
  kts_80_se: number;
  kts_80_sw: number;
  kts_80_nw: number;
  created_by: number;
  created_on: string;
  updated_by: number;
  updated_on: string;
  distance_in_miles: number;
  storm_category_id: number;
  last_accessed_on: string;
}

export default function DashBoard() {
  const windowWidth = useRef(window.innerWidth);
  const [stormData, setStormData] = useState<StormTrack[]>([]);
  const [mapHovers, setMapHovers] = useState<{ [key: string]: MapHover }>({});
  const [loadedDatas, setLoadedDatas] = useState(false);
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
  
    const data = {
         "track_datas": [
             {
                 "storm_track_id": 383,
                 "storm_name": "11W SHANSHAN",
                 "storm_description": null,
                 "status_id": 8,
                 "created_by": 22,
                 "created_on": "2024-08-21",
                 "updated_by": 20,
                 "updated_on": "2024-08-22",
                 "last_accessed_on": "2024-08-22T09:03:45.837175"
             }
         ],
         "storm_datas": [
             [
                 {
                     "storm_path_data_id": 35677,
                     "storm_path_id": 4668,
                     "id_index": 1,
                     "lat": 33.5,
                     "lon": 131.1,
                     "date_utc": "2024-08-29T18:00:00",
                     "time_utc": "2024-08-29T18:00:00",
                     "heading": 69.19205442858083,
                     "speed_kts": 4.37,
                     "max_wind_speed": 50.0,
                     "max_gust": 65.0,
                     "central_pressure": 963.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 110.0,
                     "kts_34_se": 110.0,
                     "kts_34_sw": 110.0,
                     "kts_34_nw": 110.0,
                     "kts_50_ne": 40.0,
                     "kts_50_se": 40.0,
                     "kts_50_sw": 40.0,
                     "kts_50_nw": 40.0,
                     "kts_64_ne": 20.0,
                     "kts_64_se": 20.0,
                     "kts_64_sw": 20.0,
                     "kts_64_nw": 20.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 52.39477537444778,
                     "storm_category_id": 61,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35672,
                     "storm_path_id": 4668,
                     "id_index": 2,
                     "lat": 33.81,
                     "lon": 132.08,
                     "date_utc": "2024-08-30T06:00:00",
                     "time_utc": "2024-08-30T06:00:00",
                     "heading": 86.80530785739427,
                     "speed_kts": 6.28,
                     "max_wind_speed": 45.0,
                     "max_gust": 55.0,
                     "central_pressure": 972.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 80.0,
                     "kts_34_se": 80.0,
                     "kts_34_sw": 80.0,
                     "kts_34_nw": 80.0,
                     "kts_50_ne": 30.0,
                     "kts_50_se": 30.0,
                     "kts_50_sw": 30.0,
                     "kts_50_nw": 30.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 75.41551572138704,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35673,
                     "storm_path_id": 4668,
                     "id_index": 3,
                     "lat": 33.88,
                     "lon": 133.59,
                     "date_utc": "2024-08-30T18:00:00",
                     "time_utc": "2024-08-30T18:00:00",
                     "heading": 88.4833884891782,
                     "speed_kts": 3.78,
                     "max_wind_speed": 35.0,
                     "max_gust": 45.0,
                     "central_pressure": 987.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 60.0,
                     "kts_34_se": 60.0,
                     "kts_34_sw": 60.0,
                     "kts_34_nw": 60.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 45.370439546372374,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35674,
                     "storm_path_id": 4668,
                     "id_index": 4,
                     "lat": 33.9,
                     "lon": 134.5,
                     "date_utc": "2024-08-31T06:00:00",
                     "time_utc": "2024-08-31T06:00:00",
                     "heading": 77.18582834271024,
                     "speed_kts": 2.26,
                     "max_wind_speed": 30.0,
                     "max_gust": 40.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 27.07089682593226,
                     "storm_category_id": 2,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35675,
                     "storm_path_id": 4668,
                     "id_index": 5,
                     "lat": 34.0,
                     "lon": 135.03,
                     "date_utc": "2024-08-31T18:00:00",
                     "time_utc": "2024-08-31T18:00:00",
                     "heading": 75.59800741740617,
                     "speed_kts": 2.01,
                     "max_wind_speed": 25.0,
                     "max_gust": 35.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 24.139431890743662,
                     "storm_category_id": 59,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 },
                 {
                     "storm_path_data_id": 35676,
                     "storm_path_id": 4668,
                     "id_index": 6,
                     "lat": 34.1,
                     "lon": 135.5,
                     "date_utc": "2024-09-01T06:00:00",
                     "time_utc": "2024-09-01T06:00:00",
                     "heading": 224.39376580569265,
                     "speed_kts": 0.0,
                     "max_wind_speed": 20.0,
                     "max_gust": 30.0,
                     "central_pressure": 991.0,
                     "output_unit_id": 24,
                     "kts_34_ne": 0.0,
                     "kts_34_se": 0.0,
                     "kts_34_sw": 0.0,
                     "kts_34_nw": 0.0,
                     "kts_50_ne": 0.0,
                     "kts_50_se": 0.0,
                     "kts_50_sw": 0.0,
                     "kts_50_nw": 0.0,
                     "kts_64_ne": 0.0,
                     "kts_64_se": 0.0,
                     "kts_64_sw": 0.0,
                     "kts_64_nw": 0.0,
                     "kts_80_ne": 0.0,
                     "kts_80_se": 0.0,
                     "kts_80_sw": 0.0,
                     "kts_80_nw": 0.0,
                     "created_by": 22,
                     "created_on": "2024-08-29T12:26:57.267209",
                     "updated_by": 23,
                     "updated_on": "2024-08-30T01:42:06.753211",
                     "distance_in_miles": 54.63419482661779,
                     "storm_category_id": 59,
                     "last_accessed_on": "2024-08-29T12:26:57.294653"
                 }
             ]
         ],
         "map_hovers": {
             "storm_383": {
                 "lat": 33.5,
                 "lon": 131.1
             }
         }
      }
    
    if (!data.track_datas || !data.map_hovers) {
      setLoadedDatas(true);
      return;
    }
    setStormData(data.track_datas);
    setMapHovers(data.map_hovers);
    setLoadedDatas(true);
  }, [loadedDatas]);

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full" sx={{ width: '100%' }}>
        <div className="content-wrap dashboard">
          <Main open={open} className={"main"}>
            <Grid container spacing={2} display={"flex"} alignItems={"start"}>
              <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                <Grid container spacing={3}>
                  <CardPlan />
                </Grid>
              </Grid>
              <Grid item xs={12} md={3} sx={{ marginBottom: "2em", height: "60vh" }} order={{ xs: 1, md: 2 }}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "15px",
                  }}
                >
                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Active Warnings
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Squall Warnings
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ textAlign: "center" }}
                    >
                      Typhoon Warnings
                    </Typography>
                    {stormData.map((data) =>
                      mapHovers[`storm_${data.storm_track_id}`] &&
                      mapHovers[`storm_${data.storm_track_id}`].lon !== undefined && (
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

