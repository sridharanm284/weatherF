import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useState, useRef, useEffect } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from '@mui/material/Typography';


import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios from "axios";
import WeatherLoader from "../../components/loader";

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

interface ScrapeGraphData {
  datetimeutc: string;
  a_10mwinddir?: number;
  a_10mwindspeed?: number;
  a_10mgust?: number;
  a_50mwindspeed?: number;
  a_80mwindspeed?: number;
  a_100mwindspeed?: number;
  windseaheight?: number;
  windseaperiod?: number;
  swell1height?: number;
  swell1period?: number;
  swell1direction?: number;
  swell2height?: number;
  swell2period?: number;
  swell2direction?: number;
  cloudbase?: number;
  modelvisibility?: number;
  rainrate?: number;
  a_2mtemp?: number;
  totalprecip?: number;
  mslp?: number;
  maxwave?: number;
  sigwaveheight?: number;
  surfacecurrentdirection?: number;
  surfacecurrentspeed?: number;
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

export default function Overview() {
  const windowWidths = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidths.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);

  const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
  const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([]);
  const [SelectValue, setSelectValue] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [wind, setWind] = useState(0);
  const [windwave, setWindWave] = useState(0);
  const [swell1, setSwell1] = useState(0);
  const [swell2, setSwell2] = useState(0);
  const [currents, setCurrents] = useState(0);
  const [total, setTotal] = useState(0);
  const [weather, setWeather] = useState(0);
  const [tableHeader, setTableHeaders] = useState<any>([]);
  const [forecastDatas, setForecastDatas] = useState<any>([]);
  const [TableDatas, setTableDatas] = useState<any>([]);
  const [subject, setSubject] = useState<any>("");
  const [validity_a, setValidity_a] = useState<any>("");
  const [validity_b, setValidity_b] = useState<any>("");
  const [noDataMessage, setNoDataMessage] = useState(""); 
  const [discussion, setDiscussion] = useState<any>("");
  const [disDetail, setDisDetail] = useState<any>("");
  const [interval, setInterval] = useState<number>(3);

  //const windowWidthRef = useRef();

  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidths.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hardcodedData =  
       {"criteria_datas": 
        [{"forecast_osf_criteria_id": 5137,"forecast_id": 7373,"criteria_name": "Winds > 20 knots OR Hs Combined > 2.0m"},
        {"forecast_osf_criteria_id": 5138,"forecast_id": 7373,"criteria_name": "Winds > 15 knots OR Hs Combined > 1.5m"},
        {"forecast_osf_criteria_id": 5139,"forecast_id": 7373,"criteria_name": "Winds > 25 knots OR Hs Combined > 2.5m"}],
        
        "criteria_detail_datas": [{"forecast_osf_criteria_id": 5137,"field_id": 2,"value": "20.00","margin_value": "16.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
          {"forecast_osf_criteria_id": 5137,"field_id": 62,"value": "2.00","margin_value": "1.60","comparison_operator_id": 2,"field_name": "sigwaveheight"},
          {"forecast_osf_criteria_id": 5138,"field_id": 2,"value": "15.00","margin_value": "12.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
          {"forecast_osf_criteria_id": 5138,"field_id": 62,"value": "1.50","margin_value": "1.20","comparison_operator_id": 2,"field_name": "sigwaveheight"},
          {"forecast_osf_criteria_id": 5139,"field_id": 62,"value": "2.50","margin_value": "2.00","comparison_operator_id": 2,"field_name": "sigwaveheight"},
          {"forecast_osf_criteria_id": 5139,"field_id": 2,"value": "25.00","margin_value": "20.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"}],
          "datas": [[{"datetimeutc": "11/11/2024 00:00","a_10mwindspeed": 4.99,"a_10mgust": 6.5,"a_50mwindspeed": 7.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.5,"swell1period": 5.74,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 0.9,"sigwaveheight": 0.51,"surfacecurrentdirection": 48.38,"surfacecurrentspeed": 0.52,"a_10mwinddir": 315.26,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},
            {"datetimeutc": "11/11/2024 03:00","a_10mwindspeed": 4.95,"a_10mgust": 6.4,"a_50mwindspeed": 6.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.5,"swell1period": 5.74,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 0.9,"sigwaveheight": 0.51,"surfacecurrentdirection": 53.39,"surfacecurrentspeed": 0.41,"a_10mwinddir": 330.92,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 06:00","a_10mwindspeed": 6.22,"a_10mgust": 8.1,"a_50mwindspeed": 8.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.4,"swell1period": 5.74,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 0.8,"sigwaveheight": 0.45,"surfacecurrentdirection": 40.91,"surfacecurrentspeed": 0.77,"a_10mwinddir": 353.31,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 09:00","a_10mwindspeed": 10.42,"a_10mgust": 13.5,"a_50mwindspeed": 14.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.4,"windseaperiod": null,"swell1height": 0.4,"swell1period": 5.74,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.0,"sigwaveheight": 0.57,"surfacecurrentdirection": 41.37,"surfacecurrentspeed": 0.66,"a_10mwinddir": 354.38,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 12:00","a_10mwindspeed": 12.21,"a_10mgust": 15.9,"a_50mwindspeed": 17.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 0.3,"swell1period": 5.74,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.1,"sigwaveheight": 0.67,"surfacecurrentdirection": 41.84,"surfacecurrentspeed": 0.22,"a_10mwinddir": 22.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 15:00","a_10mwindspeed": 12.21,"a_10mgust": 15.9,"a_50mwindspeed": 17.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 0.4,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.72,"surfacecurrentdirection": 33.09,"surfacecurrentspeed": 0.5,"a_10mwinddir": 44.97,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 18:00","a_10mwindspeed": 10.08,"a_10mgust": 13.1,"a_50mwindspeed": 14.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.3,"sigwaveheight": 0.78,"surfacecurrentdirection": 32.0,"surfacecurrentspeed": 1.41,"a_10mwinddir": 41.28,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/11/2024 21:00","a_10mwindspeed": 6.84,"a_10mgust": 8.9,"a_50mwindspeed": 9.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.7,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.73,"surfacecurrentdirection": 33.06,"surfacecurrentspeed": 1.43,"a_10mwinddir": 55.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/12/2024 00:00","a_10mwindspeed": 1.74,"a_10mgust": 2.3,"a_50mwindspeed": 2.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.7,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.71,"surfacecurrentdirection": 41.75,"surfacecurrentspeed": 0.64,"a_10mwinddir": 17.66,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 03:00","a_10mwindspeed": 4.12,"a_10mgust": 5.4,"a_50mwindspeed": 5.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.7,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.71,"surfacecurrentdirection": 57.78,"surfacecurrentspeed": 0.37,"a_10mwinddir": 284.84,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 06:00","a_10mwindspeed": 5.27,"a_10mgust": 6.9,"a_50mwindspeed": 7.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.8,"swell1period": 7.55,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.4,"sigwaveheight": 0.81,"surfacecurrentdirection": 41.73,"surfacecurrentspeed": 0.92,"a_10mwinddir": 304.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 09:00","a_10mwindspeed": 4.23,"a_10mgust": 5.5,"a_50mwindspeed": 5.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.8,"swell1period": 7.32,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.4,"sigwaveheight": 0.81,"surfacecurrentdirection": 39.2,"surfacecurrentspeed": 1.03,"a_10mwinddir": 245.56,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 12:00","a_10mwindspeed": 4.4,"a_10mgust": 5.7,"a_50mwindspeed": 6.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.7,"swell1period": 7.11,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.71,"surfacecurrentdirection": 51.0,"surfacecurrentspeed": 0.4,"a_10mwinddir": 260.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 15:00","a_10mwindspeed": 6.47,"a_10mgust": 8.4,"a_50mwindspeed": 9.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.7,"swell1period": 6.83,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.73,"surfacecurrentdirection": 53.48,"surfacecurrentspeed": 0.31,"a_10mwinddir": 348.76,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 18:00","a_10mwindspeed": 8.66,"a_10mgust": 11.3,"a_50mwindspeed": 12.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.63,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.1,"sigwaveheight": 0.67,"surfacecurrentdirection": 36.77,"surfacecurrentspeed": 1.11,"a_10mwinddir": 351.88,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/12/2024 21:00","a_10mwindspeed": 9.56,"a_10mgust": 12.4,"a_50mwindspeed": 13.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.4,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.44,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.72,"surfacecurrentdirection": 38.18,"surfacecurrentspeed": 1.34,"a_10mwinddir": 17.92,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/13/2024 00:00","a_10mwindspeed": 11.73,"a_10mgust": 15.2,"a_50mwindspeed": 16.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.29,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.3,"sigwaveheight": 0.78,"surfacecurrentdirection": 57.09,"surfacecurrentspeed": 0.42,"a_10mwinddir": 34.69,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 03:00","a_10mwindspeed": 13.41,"a_10mgust": 17.4,"a_50mwindspeed": 18.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.7,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.5,"sigwaveheight": 0.92,"surfacecurrentdirection": 164.58,"surfacecurrentspeed": 0.23,"a_10mwinddir": 28.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 06:00","a_10mwindspeed": 14.58,"a_10mgust": 19.0,"a_50mwindspeed": 20.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 0.6,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.17,"surfacecurrentdirection": 37.2,"surfacecurrentspeed": 0.59,"a_10mwinddir": 63.88,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 09:00","a_10mwindspeed": 18.15,"a_10mgust": 23.6,"a_50mwindspeed": 25.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.2,"windseaperiod": null,"swell1height": 0.7,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.3,"sigwaveheight": 1.39,"surfacecurrentdirection": 30.15,"surfacecurrentspeed": 1.23,"a_10mwinddir": 79.83,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 12:00","a_10mwindspeed": 14.98,"a_10mgust": 19.5,"a_50mwindspeed": 21.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.1,"windseaperiod": null,"swell1height": 0.9,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.42,"surfacecurrentdirection": 27.51,"surfacecurrentspeed": 0.62,"a_10mwinddir": 72.08,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 15:00","a_10mwindspeed": 14.35,"a_10mgust": 18.7,"a_50mwindspeed": 20.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 1.1,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.5,"sigwaveheight": 1.49,"surfacecurrentdirection": 27.35,"surfacecurrentspeed": 0.12,"a_10mwinddir": 60.5,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 18:00","a_10mwindspeed": 16.23,"a_10mgust": 21.1,"a_50mwindspeed": 22.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.1,"windseaperiod": null,"swell1height": 1.2,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.7,"sigwaveheight": 1.63,"surfacecurrentdirection": 29.97,"surfacecurrentspeed": 0.79,"a_10mwinddir": 60.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/13/2024 21:00","a_10mwindspeed": 16.21,"a_10mgust": 21.1,"a_50mwindspeed": 22.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.1,"windseaperiod": null,"swell1height": 1.2,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.7,"sigwaveheight": 1.63,"surfacecurrentdirection": 30.27,"surfacecurrentspeed": 1.39,"a_10mwinddir": 65.19,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/14/2024 00:00","a_10mwindspeed": 15.58,"a_10mgust": 20.3,"a_50mwindspeed": 21.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 1.1,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.5,"sigwaveheight": 1.49,"surfacecurrentdirection": 32.77,"surfacecurrentspeed": 0.59,"a_10mwinddir": 63.14,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 03:00","a_10mwindspeed": 14.43,"a_10mgust": 18.8,"a_50mwindspeed": 20.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.9,"windseaperiod": null,"swell1height": 1.1,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.42,"surfacecurrentdirection": 198.05,"surfacecurrentspeed": 0.18,"a_10mwinddir": 59.72,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 06:00","a_10mwindspeed": 12.81,"a_10mgust": 16.7,"a_50mwindspeed": 17.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.8,"windseaperiod": null,"swell1height": 1.0,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.28,"surfacecurrentdirection": 37.0,"surfacecurrentspeed": 0.49,"a_10mwinddir": 66.21,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 09:00","a_10mwindspeed": 11.35,"a_10mgust": 14.8,"a_50mwindspeed": 15.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 1.0,"swell1period": 6.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.17,"surfacecurrentdirection": 32.45,"surfacecurrentspeed": 1.48,"a_10mwinddir": 78.1,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 12:00","a_10mwindspeed": 7.98,"a_10mgust": 10.4,"a_50mwindspeed": 11.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 1.0,"swell1period": 5.97,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.04,"surfacecurrentdirection": 30.49,"surfacecurrentspeed": 0.99,"a_10mwinddir": 58.72,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 15:00","a_10mwindspeed": 6.78,"a_10mgust": 8.8,"a_50mwindspeed": 9.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.9,"swell1period": 6.19,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.5,"sigwaveheight": 0.92,"surfacecurrentdirection": 33.69,"surfacecurrentspeed": 0.15,"a_10mwinddir": 50.45,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 18:00","a_10mwindspeed": 6.97,"a_10mgust": 9.1,"a_50mwindspeed": 9.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.8,"swell1period": 5.64,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.4,"sigwaveheight": 0.82,"surfacecurrentdirection": 32.96,"surfacecurrentspeed": 0.53,"a_10mwinddir": 66.2,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/14/2024 21:00","a_10mwindspeed": 4.2,"a_10mgust": 5.5,"a_50mwindspeed": 5.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 0.8,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.4,"sigwaveheight": 0.81,"surfacecurrentdirection": 31.1,"surfacecurrentspeed": 1.42,"a_10mwinddir": 64.34,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/15/2024 00:00","a_10mwindspeed": 4.71,"a_10mgust": 6.1,"a_50mwindspeed": 6.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 0.7,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.73,"surfacecurrentdirection": 33.9,"surfacecurrentspeed": 0.87,"a_10mwinddir": 28.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 03:00","a_10mwindspeed": 7.76,"a_10mgust": 10.1,"a_50mwindspeed": 10.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 0.7,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.3,"sigwaveheight": 0.76,"surfacecurrentdirection": 175.6,"surfacecurrentspeed": 0.2,"a_10mwinddir": 37.26,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 06:00","a_10mwindspeed": 10.47,"a_10mgust": 13.6,"a_50mwindspeed": 14.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.4,"windseaperiod": null,"swell1height": 0.6,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.2,"sigwaveheight": 0.72,"surfacecurrentdirection": 55.65,"surfacecurrentspeed": 0.32,"a_10mwinddir": 20.31,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 09:00","a_10mwindspeed": 12.48,"a_10mgust": 16.2,"a_50mwindspeed": 17.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 0.5,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.3,"sigwaveheight": 0.78,"surfacecurrentdirection": 35.49,"surfacecurrentspeed": 1.67,"a_10mwinddir": 53.38,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 12:00","a_10mwindspeed": 15.35,"a_10mgust": 20.0,"a_50mwindspeed": 21.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 0.4,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.8,"sigwaveheight": 1.08,"surfacecurrentdirection": 31.79,"surfacecurrentspeed": 1.64,"a_10mwinddir": 45.52,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 15:00","a_10mwindspeed": 19.15,"a_10mgust": 24.9,"a_50mwindspeed": 26.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.4,"windseaperiod": null,"swell1height": 0.3,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.43,"surfacecurrentdirection": 32.3,"surfacecurrentspeed": 0.63,"a_10mwinddir": 23.16,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 18:00","a_10mwindspeed": 17.91,"a_10mgust": 23.3,"a_50mwindspeed": 25.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.3,"windseaperiod": null,"swell1height": 0.3,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.33,"surfacecurrentdirection": 32.63,"surfacecurrentspeed": 0.68,"a_10mwinddir": 23.56,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/15/2024 21:00","a_10mwindspeed": 16.1,"a_10mgust": 20.9,"a_50mwindspeed": 22.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.1,"windseaperiod": null,"swell1height": 0.3,"swell1period": 5.53,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.14,"surfacecurrentdirection": 33.21,"surfacecurrentspeed": 1.65,"a_10mwinddir": 19.77,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}]]}
        setCriteriaDatas(hardcodedData.criteria_datas || []);

        setCriteriaDetailDatas(hardcodedData.criteria_detail_datas || []);
        setTableDatas(hardcodedData.datas || []);
        setSelectValue(
          String(hardcodedData.criteria_detail_datas[0]?.forecast_osf_criteria_id || "")
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching table data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  
  function dateFormat(date: Date) {
    var montharray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var dayarray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var day = dayarray[date.getDay()];
    var d = date.getDate();
    var m = montharray[date.getMonth()];
    return day + " " + (date.getHours() === 0 ? d - 1 : d) + " " + m;
  }
  
  function getColor(criteriaDetailDatas: any[], data: any, SelectValue: string) {
    const selectedCriteria = criteriaDetailDatas.filter(
        (c_data) => c_data.forecast_osf_criteria_id === parseInt(SelectValue)
    );

    if (selectedCriteria.length === 0) {
        return "white";
    }

    const fieldMap: Record<number, any> = {};
    selectedCriteria.forEach((c_data) => {
        fieldMap[c_data.field_id] = c_data;
    });

    const colorResults = selectedCriteria.map((c_data) => {
        const fieldValue = data[c_data.field_name];
        return getColorForField(fieldValue, parseFloat(c_data.margin_value), parseFloat(c_data.value));
    });

    if (colorResults.includes("red_overview")) {
        return "red_overview";
    } else if (colorResults.every((color) => color === "green_overview")) {
        return "green_overview";
    } else if (
        colorResults.includes("yellow_overview") &&
        colorResults.includes("green_overview")
    ) {
        return "yellow_overview";
    } else if (colorResults.every((color) => color === "yellow_overview")) {
        return "yellow_overview";
    }

    return "white";
}



function getColorForField(data: number | undefined, marginValue: number, value: number) {
    if (data === undefined || data === null) {
        return "white";
    }
    if (data > value) {
        return "red_overview";
    } else if (data > marginValue && data <= value) {
        return "yellow_overview";
    } else if (data <= marginValue) {
        return "green_overview";
    }
    return "white";
}

  function dateformatting(date: any) {
    var day = date.slice(0, 2);
    var month = date.slice(3, 5);
    var remain = date.slice(6);
    var newdate = day + "/" + month + "/" + remain;
    return new Date(newdate);
  }

  function calculateWindDir(data: number) {
    if (data === 0) return 'N'; 
    let calc: Array<Array<any>> = [];
    let calcData: any = {
      NNE: 22.5,
      NE: 45,
      ENE: 67.5,
      E: 90,
      ESE: 112.5,
      SE: 135,
      SSE: 157.5,
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

  function formatDate1(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    return `${hours}/${day}`;
  }
  

  function ScrapeGraphDatas() {
    let data_list: Array<object> = [];
    TableDatas.forEach((datas: any) => {
      datas.forEach((data: any) => {
        data["date"] = dateFormat(dateformatting(data.datetimeutc));
        data_list.push(data);
      });
    });
    return data_list;
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const direction = windowWidth > 650 ? "row" : "column";


  const formatTime = (datetimeutc: string) => {
    const date = new Date(datetimeutc);
    const hours = date.getHours().toString().padStart(2, '0'); 
    return `${hours}:00`;
  };
  
  const formatDate = (datetimeutc: string) => {
    const date = new Date(datetimeutc);
    return date.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });
  };
  


  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap dashboard">
          <Main
            open={open}
            className={"main"}
            style={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <div className={"maincontainer"}>
              <div className={"heading-container"}>
                <span className={"heading"}>5 Day Forecast Quick Summary </span>
                <Stack
                  className={"weather_window"}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9",
                    maxWidth: "100%",
                  }}
                >
                  <span className={"heading"}>
                    Weather Window Criteria Name
                  </span>
                  <FormControl
                    sx={{ m: 1, minWidth: 180, width: "100%" }}
                    size="small"
                  >
                    <Select
                      labelId="model-data"
                      id="model-data"
                      value={SelectValue}
                      onChange={(s) => {
                        if (s.target.value === "No datas Available") {
                          return;
                        }
                        setSelectValue(s.target.value);
                      }}
                      style={{
                        height: 30,
                        backgroundColor: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                        fontSize: 15,
                      }}
                    >
                      {criteriaDatas.length === 0 ? (
                        <MenuItem value="No datas Available">
                          No datas Available
                        </MenuItem>
                      ) : (
                        criteriaDatas.map((data: any) => (
                          <MenuItem
                            key={data.forecast_osf_criteria_id}
                            value={data.forecast_osf_criteria_id}
                          >
                            {data.criteria_name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Stack>
              </div>
              {loading ? (
                <div className={"overview_table_container"}>
                  <WeatherLoader />
                </div>
              ) : criteriaDatas.length === 0 ? (
                <h1>No Criteria Datas Available</h1>
              ) : (
                <div className={"overview_table_container"}>
       <Stack
  className={"graph"}
  direction="column"
  spacing={3}
  sx={{
    alignItems: "center",
  }}
>
  {[
    { name: "Wind", dataKeys: ["a_10mwindspeed", "a_10mgust", "a_50mwindspeed", "a_80mwindspeed", "a_100mwindspeed"], color: "#8884d8", directionKey: "a_10mwinddir" },
    { name: "Wind Wave", dataKeys: ["windseaheight", "windseaperiod"], color: "#82ca9d", directionKey: "windseadirection" },
    { name: "Swell 1", dataKeys: ["swell1height", "swell1period"], color: "#ff8c00", directionKey: "swell1direction" },
    { name: "Swell 2", dataKeys: ["swell2height", "swell2period"], color: "#ff69b4", directionKey: "swell2direction" },
    { name: "Weather", dataKeys: ["cloudbase", "modelvisibility", "rainrate", "a_2mtemp", "totalprecip", "mslp"], color: "#a4de6c" },
    { name: "Total Waves", dataKeys: ["maxwave", "sigwaveheight"], color: "#ffd700", directionKey: "peakwavedir" },
    { name: "Currents", dataKeys: ["surfacecurrentspeed"], color: "#8884d8", directionKey: "surfacecurrentdirection" },
  ].map((chart, index) => {
    const hasData = chart.dataKeys.some((key) =>
      ScrapeGraphDatas().some((data) => (data as Record<string, any>)[key] != null)
    );

    return (
      hasData && (
        <Box key={index} sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>{chart.name}</Typography>

          <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    mb: 1,
    maxWidth: '80%',
    ml: 8, 
  }}
>
  {ScrapeGraphDatas().map((data, i) => {
    const directionValue = chart.directionKey ? data[chart.directionKey as keyof typeof data] : null;
    return (
      directionValue != null && (
        <Box
          key={i}
          sx={{
            width: `${100 / ScrapeGraphDatas().length}%`,
            maxWidth: '100px',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: 4, whiteSpace: 'nowrap' }}>
            {`${calculateWindDir(directionValue as number)}`}
          </Typography>
        </Box>
      )
    );
  })}
</Box>

          <AreaChart
            width={650} 
            height={200}
            data={ScrapeGraphDatas()}
            margin={{ top: 15, right: 30, left: 0 }}
          >
            <defs>
              <linearGradient id={`color${chart.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chart.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="datetimeutc"
              axisLine={false}
              tick={{ fontSize: 5 }}
              tickLine={false}
              interval={0}
              padding={{ left: 20, right: 20 }}
              tickFormatter={(value, index) => (index % 1 === 0 ? formatDate1(value) : "")}
            />
            <YAxis yAxisId="left" />
            <Tooltip contentStyle={{ borderRadius: "8px" }} />
            {chart.dataKeys.map((dataKey) =>
              ScrapeGraphDatas().some((data) => (data as Record<string, any>)[dataKey] != null) ? (
                <Area
                  key={dataKey}
                  type="monotone"
                  name={`${chart.name} - ${dataKey}`}
                  dataKey={dataKey}
                  stroke={chart.color}
                  fillOpacity={0.3}
                  fill={`url(#color${chart.name})`}
                  yAxisId="left"
                />
              ) : null
            )}
          </AreaChart>
        </Box>
      )
    );
  })}
</Stack>
<Paper
  sx={{
    width: "90%",
    overflow: "hidden",
    borderRadius: "10px",
  }}
>
  <TableContainer sx={{ maxHeight: "100%" }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {TableDatas.map((datas: any, rowIndex: number) => (
            <TableCell
              key={rowIndex}
              style={{
                padding: 0,
                borderRight: "1px solid #e0e0e0",
              }}
            >
              <div className={"mini_color_box"} style={{ display: 'flex', flexDirection: 'row' }}>
                {datas.map((data: any, innerIndex: number) => {
                  console.log(data.datetimeutc);
                  console.log(data.sigwaveheight, data.a_10mwindspeed, data.maxwave)

                  return (
                    <div
                      key={innerIndex}
                      style={{
                        width: "100%",
                        position: "relative",
                        textAlign: "center",
                      }}
                      className={getColor(criteriaDetailDatas, data, SelectValue)}
                      
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "0px",
                          width: "100%",
                          fontSize: "10px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {formatTime(data.datetimeutc)}
                      </span>
                      <span style={{ visibility: 'hidden' }}>
                        {formatTime(data.datetimeutc)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {TableDatas.map((datas: any, rowIndex: number) => (
            <TableCell
              key={rowIndex}
              style={{
                textAlign: "center",
                borderRight: "1px solid #e0e0e0",
              }}
            >
              {formatDate(datas[0].datetimeutc)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</Paper>


                
                </div>
              )}
            </div>
          </Main>
        </div>
      </Box>
    </div>
  );
}
