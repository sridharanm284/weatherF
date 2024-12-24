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

type Data = { [key: string]: any };

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
         [{"forecast_osf_criteria_id": 626,"forecast_id": 1294,"criteria_name": "Seas over 1.5m"},
          {"forecast_osf_criteria_id": 627,"forecast_id": 1294,"criteria_name": "Seas over 2.0m"},
          {"forecast_osf_criteria_id": 628,"forecast_id": 1294,"criteria_name": "Seas over 2.5m"},
          {"forecast_osf_criteria_id": 623,"forecast_id": 1294,"criteria_name": "Onset 50 kn or 6m seas"},
          {"forecast_osf_criteria_id": 624,"forecast_id": 1294,"criteria_name": "Onset 35kn or 4m seas"},
          {"forecast_osf_criteria_id": 625,"forecast_id": 1294,"criteria_name": "Environmental Limits"},
          {"forecast_osf_criteria_id": 629,"forecast_id": 1294,"criteria_name": "Typhoon Disconnection"},
          {"forecast_osf_criteria_id": 630,"forecast_id": 1294,"criteria_name": "Helicopter Ops"},
          {"forecast_osf_criteria_id": 622,"forecast_id": 1294,"criteria_name": "Onset 80 kn or 9m seas"}],
          
          
          "criteria_detail_datas": 
          
          
          [{"forecast_osf_criteria_id": 622,"field_id": 2,"value": "80.00","margin_value": "63.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
            
            
            
            
            {"forecast_osf_criteria_id": 622,"field_id": 62,"value": "9.00","margin_value": "7.10","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            
            
            {"forecast_osf_criteria_id": 623,"field_id": 2,"value": "50.00","margin_value": "39.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
            
            
            {"forecast_osf_criteria_id": 623,"field_id": 62,"value": "6.00","margin_value": "4.70","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 624,"field_id": 2,"value": "35.00","margin_value": "27.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
            
            
            {"forecast_osf_criteria_id": 624,"field_id": 62,"value": "4.00","margin_value": "3.20","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 625,"field_id": 2,"value": "25.00","margin_value": "14.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
            
            {"forecast_osf_criteria_id": 625,"field_id": 62,"value": "3.00","margin_value": "1.50","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            
            {"forecast_osf_criteria_id": 626,"field_id": 62,"value": "1.50","margin_value": "1.20","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 627,"field_id": 62,"value": "2.00","margin_value": "1.60","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 628,"field_id": 62,"value": "2.50","margin_value": "2.00","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 629,"field_id": 62,"value": "9.00","margin_value": "7.20","comparison_operator_id": 2,"field_name": "sigwaveheight"},
            
            {"forecast_osf_criteria_id": 629,"field_id": 52,"value": "10.20","margin_value": "9.20","comparison_operator_id": 2,"field_name": "swell1period"},
            
            {"forecast_osf_criteria_id": 629,"field_id": 2,"value": "83.00","margin_value": "66.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"},
            
            {"forecast_osf_criteria_id": 630,"field_id": 2,"value": "50.00","margin_value": "40.00","comparison_operator_id": 2,"field_name": "a_10mwindspeed"}],
            
            
            
            "datas": [[{"datetimeutc": "12/18/2024 08:00","a_10mwindspeed": 5.13,"a_10mgust": 6.7,"a_50mwindspeed": 7.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.23,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 111.04,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/18/2024 11:00","a_10mwindspeed": 3.21,"a_10mgust": 4.2,"a_50mwindspeed": 4.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.8,"sigwaveheight": 1.21,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 38.44,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/18/2024 14:00","a_10mwindspeed": 5.3,"a_10mgust": 6.9,"a_50mwindspeed": 7.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.23,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 347.66,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/18/2024 17:00","a_10mwindspeed": 6.07,"a_10mgust": 7.9,"a_50mwindspeed": 8.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.13,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 0.28,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/18/2024 20:00","a_10mwindspeed": 10.28,"a_10mgust": 13.4,"a_50mwindspeed": 14.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.15,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 35.83,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/18/2024 23:00","a_10mwindspeed": 9.07,"a_10mgust": 11.8,"a_50mwindspeed": 12.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.13,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 61.69,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"}],[{"datetimeutc": "12/19/2024 02:00","a_10mwindspeed": 7.49,"a_10mgust": 9.7,"a_50mwindspeed": 10.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.13,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 44.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 05:00","a_10mwindspeed": 5.0,"a_10mgust": 6.5,"a_50mwindspeed": 7.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.6,"sigwaveheight": 1.02,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 66.57,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 08:00","a_10mwindspeed": 5.0,"a_10mgust": 6.5,"a_50mwindspeed": 7.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.6,"sigwaveheight": 1.02,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 118.32,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 11:00","a_10mwindspeed": 4.0,"a_10mgust": 5.2,"a_50mwindspeed": 5.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.6,"sigwaveheight": 1.02,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 50.86,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 14:00","a_10mwindspeed": 5.1,"a_10mgust": 6.6,"a_50mwindspeed": 7.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.6,"sigwaveheight": 1.03,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 348.71,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 17:00","a_10mwindspeed": 5.64,"a_10mgust": 7.3,"a_50mwindspeed": 7.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.6,"sigwaveheight": 1.03,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 354.48,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 20:00","a_10mwindspeed": 4.15,"a_10mgust": 5.4,"a_50mwindspeed": 5.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.11,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 8.32,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/19/2024 23:00","a_10mwindspeed": 2.57,"a_10mgust": 3.3,"a_50mwindspeed": 3.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.11,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 134.47,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"}],[{"datetimeutc": "12/20/2024 02:00","a_10mwindspeed": 5.1,"a_10mgust": 6.6,"a_50mwindspeed": 7.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.13,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 165.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 05:00","a_10mwindspeed": 6.53,"a_10mgust": 8.5,"a_50mwindspeed": 9.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.23,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 178.53,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 08:00","a_10mwindspeed": 5.71,"a_10mgust": 7.4,"a_50mwindspeed": 8.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.23,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 170.75,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 11:00","a_10mwindspeed": 5.48,"a_10mgust": 7.1,"a_50mwindspeed": 7.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.4,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.23,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 217.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 14:00","a_10mwindspeed": 7.69,"a_10mgust": 10.0,"a_50mwindspeed": 10.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.3,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.32,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 264.22,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 17:00","a_10mwindspeed": 6.54,"a_10mgust": 8.5,"a_50mwindspeed": 9.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.3,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.32,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 258.76,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 20:00","a_10mwindspeed": 3.0,"a_10mgust": 3.9,"a_50mwindspeed": 4.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 211.84,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/20/2024 23:00","a_10mwindspeed": 5.08,"a_10mgust": 6.6,"a_50mwindspeed": 7.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.42,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 126.36,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"}],[{"datetimeutc": "12/21/2024 02:00","a_10mwindspeed": 5.16,"a_10mgust": 6.7,"a_50mwindspeed": 7.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.42,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 128.99,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 05:00","a_10mwindspeed": 6.98,"a_10mgust": 9.1,"a_50mwindspeed": 9.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.42,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 160.27,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 08:00","a_10mwindspeed": 5.31,"a_10mgust": 6.9,"a_50mwindspeed": 7.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.42,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 171.66,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 11:00","a_10mwindspeed": 3.19,"a_10mgust": 4.1,"a_50mwindspeed": 4.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.5,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.3,"sigwaveheight": 1.51,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 190.14,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 14:00","a_10mwindspeed": 4.47,"a_10mgust": 5.8,"a_50mwindspeed": 6.3,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 323.96,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 17:00","a_10mwindspeed": 4.47,"a_10mgust": 5.8,"a_50mwindspeed": 6.3,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 311.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 20:00","a_10mwindspeed": 7.0,"a_10mgust": 9.1,"a_50mwindspeed": 9.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 354.92,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/21/2024 23:00","a_10mwindspeed": 4.08,"a_10mgust": 5.3,"a_50mwindspeed": 5.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 100.03,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"}],[{"datetimeutc": "12/22/2024 02:00","a_10mwindspeed": 6.0,"a_10mgust": 7.8,"a_50mwindspeed": 8.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 141.71,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/22/2024 05:00","a_10mwindspeed": 6.22,"a_10mgust": 8.1,"a_50mwindspeed": 8.7,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 237.46,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"},{"datetimeutc": "12/22/2024 08:00","a_10mwindspeed": 3.83,"a_10mgust": 5.0,"a_50mwindspeed": 5.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.1,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.5,"swell1direction": 315.0,"swell2height": 0.15,"swell2period": 5.8,"swell2direction": 337.5,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.41,"surfacecurrentdirection": null,"surfacecurrentspeed": null,"a_10mwinddir": 335.47,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+08:00) Kuala Lumpur, Singapore"}]]}
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
              ) : data.length === 0 ? (
                <h1>No Criteria Datas Available</h1>
              ) : (
                <div className={"overview_table_container"}>


                  
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

    <Stack
  className={"graph"}
  direction="column"
  spacing={3}
  sx={{
    alignItems: "center",
  }}
>
  {[
    {
      name: "Wind",
      dataKeys: ["a_10mwindspeed", "a_10mgust", "a_50mwindspeed", "a_80mwindspeed", "a_100mwindspeed"],
      color: "#8884d8",
      directionKey: "a_10mwinddir",
    },
    {
      name: "Wind Wave",
      dataKeys: ["windseaheight", "windseaperiod"],
      color: "#82ca9d",
      directionKey: "windseadirection",
    },
    {
      name: "Weather",
      dataKeys: ["cloudbase", "modelvisibility", "rainrate", "a_2mtemp", "totalprecip", "mslp"],
      color: "#a4de6c",
    },
    {
      name: "Currents",
      dataKeys: [
        "maxwave",
        "sigwaveheight",
        "swell1height",
        "swell1period",
        "swell2height",
        "swell2period",
        "surfacecurrentspeed",
      ],
      color: "#ff6347",
      directionKey: null,
    },
  ].map((chart, index) => {
    const hasData = chart.dataKeys.some((key) =>
      ScrapeGraphDatas().some((data: any) => data[key] !== null && data[key] !== undefined)

    );

    return (
      hasData && (
        <Box key={index} sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {chart.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 1,
              maxWidth: "80%",
              ml: 8,
            }}
          >
            {chart.dataKeys
              .sort((keyA, keyB) => {
                const maxValueA = Math.max(
                  ...ScrapeGraphDatas().map((data:any) =>
                    (data[keyA] != null ? (data[keyA] as number) : -Infinity)

                  )
                );
                const maxValueB = Math.max(
                  ...ScrapeGraphDatas().map((data:any) =>
                    data[keyB] != null ? (data[keyB] as number) : -Infinity
                  )
                );
                return maxValueB - maxValueA;
              })
              .map((dataKey, i) => {
                const maxValue = Math.max(
                  ...ScrapeGraphDatas().map((data:any) =>
                    data[dataKey] != null ? (data[dataKey] as number) : -Infinity
                  )
                );
                return (
                  <Box
                    key={i}
                    sx={{
                      width: `${100 / chart.dataKeys.length}%`,
                      maxWidth: "100px",
                      textAlign: "center",
                    }}
                  >
                    {/* <Typography sx={{ fontSize: 4, whiteSpace: "nowrap" }}>
                      {`${dataKey}: ${maxValue}`}
                    </Typography> */}
                  </Box>
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
           <YAxis yAxisId="left" label={{  position: 'insideLeft', angle: -90 }} />
<Tooltip contentStyle={{ borderRadius: "8px" }} />
{chart.dataKeys.map((dataKey) =>
  ScrapeGraphDatas().some((data: any) => data[dataKey] != null) ? (
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

                
                </div>
              )}
            </div>
          </Main>
        </div>
      </Box>
    </div>
  );
}
