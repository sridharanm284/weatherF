import store from "../../store";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useState, useRef, useEffect } from "react";
//import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import WeatherLoader from "../../components/loader";
import "./styles/_index.scss";
import axios from "axios";

//const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
/*
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}*/

/*
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
}));*/

export default function Weather() {
  // Reference value for current Browser Window Width
  const windowWidth = useRef(window.innerWidth);

  // Sets Track about the SideNav Bar Open/Close State
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);

  const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
  const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([]);
  const [TableDatas, setTableDatas] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [SelectValue, setSelectValue] = useState<any>("");

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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const data = {"criteria_datas": [{"forecast_osf_criteria_id": 5137,"forecast_id": 7373,"criteria_name": "Winds > 20 knots OR Hs Combined > 2.0m"},{"forecast_osf_criteria_id": 5138,"forecast_id": 7373,"criteria_name": "Winds > 15 knots OR Hs Combined > 1.5m"},{"forecast_osf_criteria_id": 5139,"forecast_id": 7373,"criteria_name": "Winds > 25 knots OR Hs Combined > 2.5m"}],"criteria_detail_datas": [{"forecast_osf_criteria_id": 5137,"field_id": 2,"value": "20.00","margin_value": "16.00","comparison_operator_id": 2},{"forecast_osf_criteria_id": 5137,"field_id": 62,"value": "2.00","margin_value": "1.60","comparison_operator_id": 2},{"forecast_osf_criteria_id": 5138,"field_id": 2,"value": "15.00","margin_value": "12.00","comparison_operator_id": 2},{"forecast_osf_criteria_id": 5138,"field_id": 62,"value": "1.50","margin_value": "1.20","comparison_operator_id": 2},{"forecast_osf_criteria_id": 5139,"field_id": 62,"value": "2.50","margin_value": "2.00","comparison_operator_id": 2},{"forecast_osf_criteria_id": 5139,"field_id": 2,"value": "25.00","margin_value": "20.00","comparison_operator_id": 2}],
        
        
        
        
        
        
        "datas": [[{"datetimeutc": "11/04/2024 21:00","a_10mwindspeed": 13.0,"a_10mgust": 16.9,"a_50mwindspeed": 18.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.8,"windseaperiod": null,"swell1height": 0.4,"swell1period": 6.38,"swell1direction": 54.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.5,"sigwaveheight": 0.89,"surfacecurrentdirection": 49.69,"surfacecurrentspeed": 0.93,"a_10mwinddir": 329.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/05/2024 00:00","a_10mwindspeed": 12.5,"a_10mgust": 16.2,"a_50mwindspeed": 17.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.75,"windseaperiod": null,"swell1height": 0.4,"swell1period": 6.43,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.4,"sigwaveheight": 0.85,"surfacecurrentdirection": 43.41,"surfacecurrentspeed": 1.35,"a_10mwinddir": 333.6,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 03:00","a_10mwindspeed": 11.8,"a_10mgust": 15.3,"a_50mwindspeed": 16.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.8,"windseaperiod": null,"swell1height": 0.4,"swell1period": 6.75,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.5,"sigwaveheight": 0.89,"surfacecurrentdirection": 54.89,"surfacecurrentspeed": 0.7,"a_10mwinddir": 333.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 06:00","a_10mwindspeed": 11.8,"a_10mgust": 15.3,"a_50mwindspeed": 16.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 0.4,"swell1period": 7.16,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.8,"sigwaveheight": 1.08,"surfacecurrentdirection": 126.87,"surfacecurrentspeed": 0.28,"a_10mwinddir": 339.2,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 09:00","a_10mwindspeed": 12.1,"a_10mgust": 15.7,"a_50mwindspeed": 16.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.9,"windseaperiod": null,"swell1height": 0.6,"swell1period": 7.39,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.8,"sigwaveheight": 1.08,"surfacecurrentdirection": 55.79,"surfacecurrentspeed": 0.58,"a_10mwinddir": 343.5,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 12:00","a_10mwindspeed": 9.4,"a_10mgust": 12.2,"a_50mwindspeed": 13.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 0.9,"swell1period": 7.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.03,"surfacecurrentdirection": 38.51,"surfacecurrentspeed": 1.48,"a_10mwinddir": 12.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 15:00","a_10mwindspeed": 7.8,"a_10mgust": 10.1,"a_50mwindspeed": 10.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.4,"windseaperiod": null,"swell1height": 1.1,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.17,"surfacecurrentdirection": 36.95,"surfacecurrentspeed": 1.42,"a_10mwinddir": 8.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 18:00","a_10mwindspeed": 12.0,"a_10mgust": 15.6,"a_50mwindspeed": 16.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 1.2,"swell1period": 8.05,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.34,"surfacecurrentdirection": 43.62,"surfacecurrentspeed": 0.78,"a_10mwinddir": 349.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/05/2024 21:00","a_10mwindspeed": 15.0,"a_10mgust": 19.5,"a_50mwindspeed": 21.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.8,"windseaperiod": null,"swell1height": 1.3,"swell1period": 8.17,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.6,"sigwaveheight": 1.53,"surfacecurrentdirection": 48.84,"surfacecurrentspeed": 0.8,"a_10mwinddir": 324.5,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/06/2024 00:00","a_10mwindspeed": 16.0,"a_10mgust": 20.8,"a_50mwindspeed": 22.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.85,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.23,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.7,"sigwaveheight": 1.64,"surfacecurrentdirection": 44.27,"surfacecurrentspeed": 1.16,"a_10mwinddir": 321.1,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 03:00","a_10mwindspeed": 17.0,"a_10mgust": 22.1,"a_50mwindspeed": 23.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.9,"windseaperiod": null,"swell1height": 1.4,"swell1period": 8.07,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.8,"sigwaveheight": 1.66,"surfacecurrentdirection": 57.16,"surfacecurrentspeed": 0.74,"a_10mwinddir": 318.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 06:00","a_10mwindspeed": 18.0,"a_10mgust": 23.4,"a_50mwindspeed": 25.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.95,"windseaperiod": null,"swell1height": 1.3,"swell1period": 7.76,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.7,"sigwaveheight": 1.61,"surfacecurrentdirection": 139.07,"surfacecurrentspeed": 0.32,"a_10mwinddir": 322.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 09:00","a_10mwindspeed": 18.0,"a_10mgust": 23.4,"a_50mwindspeed": 25.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.0,"windseaperiod": null,"swell1height": 1.2,"swell1period": 7.26,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.6,"sigwaveheight": 1.56,"surfacecurrentdirection": 72.47,"surfacecurrentspeed": 0.3,"a_10mwinddir": 323.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 12:00","a_10mwindspeed": 16.0,"a_10mgust": 20.8,"a_50mwindspeed": 22.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.9,"windseaperiod": null,"swell1height": 1.2,"swell1period": 7.01,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.5,"sigwaveheight": 1.5,"surfacecurrentdirection": 36.89,"surfacecurrentspeed": 1.22,"a_10mwinddir": 332.1,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 15:00","a_10mwindspeed": 12.0,"a_10mgust": 15.6,"a_50mwindspeed": 16.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.8,"windseaperiod": null,"swell1height": 1.2,"swell1period": 7.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.44,"surfacecurrentdirection": 36.23,"surfacecurrentspeed": 1.52,"a_10mwinddir": 333.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 18:00","a_10mwindspeed": 13.0,"a_10mgust": 16.9,"a_50mwindspeed": 18.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.7,"windseaperiod": null,"swell1height": 1.1,"swell1period": 7.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.3,"surfacecurrentdirection": 38.01,"surfacecurrentspeed": 1.09,"a_10mwinddir": 328.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/06/2024 21:00","a_10mwindspeed": 10.8,"a_10mgust": 14.0,"a_50mwindspeed": 15.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.6,"windseaperiod": null,"swell1height": 1.0,"swell1period": 7.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.17,"surfacecurrentdirection": 38.61,"surfacecurrentspeed": 0.97,"a_10mwinddir": 325.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/07/2024 00:00","a_10mwindspeed": 9.9,"a_10mgust": 12.9,"a_50mwindspeed": 13.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 1.0,"swell1period": 7.34,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.12,"surfacecurrentdirection": 38.78,"surfacecurrentspeed": 1.22,"a_10mwinddir": 322.1,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 03:00","a_10mwindspeed": 10.3,"a_10mgust": 13.4,"a_50mwindspeed": 14.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 1.1,"swell1period": 7.81,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.21,"surfacecurrentdirection": 40.98,"surfacecurrentspeed": 0.97,"a_10mwinddir": 333.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 06:00","a_10mwindspeed": 11.4,"a_10mgust": 14.8,"a_50mwindspeed": 16.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.5,"windseaperiod": null,"swell1height": 1.3,"swell1period": 7.87,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.3,"sigwaveheight": 1.39,"surfacecurrentdirection": 55.54,"surfacecurrentspeed": 0.35,"a_10mwinddir": 332.7,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 09:00","a_10mwindspeed": 10.0,"a_10mgust": 13.0,"a_50mwindspeed": 14.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.45,"windseaperiod": null,"swell1height": 1.41,"swell1period": 8.03,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.5,"sigwaveheight": 1.48,"surfacecurrentdirection": 51.34,"surfacecurrentspeed": 0.33,"a_10mwinddir": 340.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 12:00","a_10mwindspeed": 10.0,"a_10mgust": 13.0,"a_50mwindspeed": 14.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.4,"windseaperiod": null,"swell1height": 1.37,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.43,"surfacecurrentdirection": 30.16,"surfacecurrentspeed": 1.04,"a_10mwinddir": 70.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 15:00","a_10mwindspeed": 8.0,"a_10mgust": 10.4,"a_50mwindspeed": 11.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 1.27,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.3,"surfacecurrentdirection": 29.65,"surfacecurrentspeed": 1.51,"a_10mwinddir": 60.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 18:00","a_10mwindspeed": 7.0,"a_10mgust": 9.1,"a_50mwindspeed": 9.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.17,"swell1period": 7.7,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.0,"sigwaveheight": 1.19,"surfacecurrentdirection": 29.87,"surfacecurrentspeed": 1.14,"a_10mwinddir": 52.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/07/2024 21:00","a_10mwindspeed": 7.0,"a_10mgust": 9.1,"a_50mwindspeed": 9.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.08,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.8,"sigwaveheight": 1.1,"surfacecurrentdirection": 30.06,"surfacecurrentspeed": 0.81,"a_10mwinddir": 55.2,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/08/2024 00:00","a_10mwindspeed": 7.8,"a_10mgust": 10.1,"a_50mwindspeed": 10.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.2,"windseaperiod": null,"swell1height": 1.0,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.02,"surfacecurrentdirection": 28.93,"surfacecurrentspeed": 0.88,"a_10mwinddir": 58.5,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 03:00","a_10mwindspeed": 9.0,"a_10mgust": 11.7,"a_50mwindspeed": 12.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.3,"windseaperiod": null,"swell1height": 0.94,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 0.99,"surfacecurrentdirection": 30.11,"surfacecurrentspeed": 0.89,"a_10mwinddir": 59.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 06:00","a_10mwindspeed": 11.0,"a_10mgust": 14.3,"a_50mwindspeed": 15.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.65,"windseaperiod": null,"swell1height": 0.8,"swell1period": 8.29,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.7,"sigwaveheight": 1.03,"surfacecurrentdirection": 28.43,"surfacecurrentspeed": 0.39,"a_10mwinddir": 65.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 09:00","a_10mwindspeed": 12.0,"a_10mgust": 15.6,"a_50mwindspeed": 16.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.84,"windseaperiod": null,"swell1height": 0.8,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 1.9,"sigwaveheight": 1.16,"surfacecurrentdirection": 47.25,"surfacecurrentspeed": 0.27,"a_10mwinddir": 79.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 12:00","a_10mwindspeed": 13.5,"a_10mgust": 17.6,"a_50mwindspeed": 18.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.15,"windseaperiod": null,"swell1height": 0.8,"swell1period": 8.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.3,"sigwaveheight": 1.4,"surfacecurrentdirection": 36.41,"surfacecurrentspeed": 0.81,"a_10mwinddir": 76.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 15:00","a_10mwindspeed": 12.8,"a_10mgust": 16.6,"a_50mwindspeed": 17.9,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.3,"windseaperiod": null,"swell1height": 0.8,"swell1period": 9.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.6,"sigwaveheight": 1.53,"surfacecurrentdirection": 33.53,"surfacecurrentspeed": 1.51,"a_10mwinddir": 69.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 18:00","a_10mwindspeed": 12.0,"a_10mgust": 15.6,"a_50mwindspeed": 16.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.1,"windseaperiod": null,"swell1height": 0.9,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.4,"sigwaveheight": 1.42,"surfacecurrentdirection": 33.61,"surfacecurrentspeed": 1.43,"a_10mwinddir": 64.8,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/08/2024 21:00","a_10mwindspeed": 11.3,"a_10mgust": 14.7,"a_50mwindspeed": 15.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.04,"windseaperiod": null,"swell1height": 0.8,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.31,"surfacecurrentdirection": 35.1,"surfacecurrentspeed": 0.98,"a_10mwinddir": 66.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}],[{"datetimeutc": "11/09/2024 00:00","a_10mwindspeed": 12.6,"a_10mgust": 16.4,"a_50mwindspeed": 17.6,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 0.98,"windseaperiod": null,"swell1height": 0.8,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.1,"sigwaveheight": 1.27,"surfacecurrentdirection": 36.9,"surfacecurrentspeed": 0.82,"a_10mwinddir": 62.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 03:00","a_10mwindspeed": 13.0,"a_10mgust": 16.9,"a_50mwindspeed": 18.2,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.04,"windseaperiod": null,"swell1height": 0.8,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.2,"sigwaveheight": 1.31,"surfacecurrentdirection": 36.3,"surfacecurrentspeed": 0.88,"a_10mwinddir": 51.4,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 06:00","a_10mwindspeed": 15.0,"a_10mgust": 19.5,"a_50mwindspeed": 21.0,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.26,"windseaperiod": null,"swell1height": 0.6,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.3,"sigwaveheight": 1.4,"surfacecurrentdirection": 39.24,"surfacecurrentspeed": 0.61,"a_10mwinddir": 50.6,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 09:00","a_10mwindspeed": 16.0,"a_10mgust": 20.8,"a_50mwindspeed": 22.4,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.4,"windseaperiod": null,"swell1height": 0.5,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.5,"sigwaveheight": 1.49,"surfacecurrentdirection": 50.79,"surfacecurrentspeed": 0.28,"a_10mwinddir": 60.0,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 12:00","a_10mwindspeed": 17.0,"a_10mgust": 22.1,"a_50mwindspeed": 23.8,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.47,"windseaperiod": null,"swell1height": 0.5,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.6,"sigwaveheight": 1.55,"surfacecurrentdirection": 41.78,"surfacecurrentspeed": 0.43,"a_10mwinddir": 56.6,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 15:00","a_10mwindspeed": 17.5,"a_10mgust": 22.8,"a_50mwindspeed": 24.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.52,"windseaperiod": null,"swell1height": 0.4,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.6,"sigwaveheight": 1.57,"surfacecurrentdirection": 34.24,"surfacecurrentspeed": 1.03,"a_10mwinddir": 53.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 18:00","a_10mwindspeed": 16.8,"a_10mgust": 21.8,"a_50mwindspeed": 23.5,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.62,"windseaperiod": null,"swell1height": 0.4,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.8,"sigwaveheight": 1.67,"surfacecurrentdirection": 33.5,"surfacecurrentspeed": 1.29,"a_10mwinddir": 50.9,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"},{"datetimeutc": "11/09/2024 21:00","a_10mwindspeed": 17.2,"a_10mgust": 22.4,"a_50mwindspeed": 24.1,"a_80mwindspeed": null,"a_100mwindspeed": null,"windseaheight": 1.61,"windseaperiod": null,"swell1height": 0.5,"swell1period": 10.0,"swell1direction": 45.0,"swell2height": 0.0,"swell2period": null,"swell2direction": null,"cloudbase": null,"modelvisibility": null,"rainrate": null,"a_2mtemp": null,"totalprecip": null,"mslp": null,"maxwave": 2.8,"sigwaveheight": 1.69,"surfacecurrentdirection": 35.5,"surfacecurrentspeed": 0.9,"a_10mwinddir": 52.3,"peakwavedir": null,"windseadirection": null,"time_zone": "(UTC+09:00) Osaka, Sapporo, Tokyo"}]]}
        
        
        setCriteriaDatas(data.criteria_datas || []);
        setCriteriaDetailDatas(data.criteria_detail_datas || []);
        setTableDatas(data.datas || []);
        setSelectValue(
          String(data.criteria_detail_datas[0]?.forecast_osf_criteria_id || "")
        );
  
        setLoading(false);
      } catch (error) {
        console.error('Error setting hardcoded table data:', error);
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
    var d = date.getDate();
    var m = montharray[date.getMonth()];
    return d + " " + m;
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

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap dashboard">
          {!loading ? (
            criteriaDatas?.length > 0 ? (
              <Main
                open={open}
                className={"main"}
                style={{
                  overflow: "auto",
                  display: "flex",
                  paddingBlock: "10px",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "35px",
                }}
              >
               <div className={"heading_div"}></div>

               <div className={"maincontainer"}>
  {TableDatas.map((datas: any) => (
    <div key={datas[0].datetimeutc} className={"mini_header_box"}>
      <div className={"mini_header_main"}>
        <span className={"mini_header_date"}>
          {dateFormat(new Date(datas[0].datetimeutc))}
        </span>
      </div>
      <div className={"mini_header_time"}>
        {datas.map((data: any) => (
          <span key={data.datetimeutc} className={"mini_header_time"}>
            {new Date(data.datetimeutc).getHours() === 0
              ? "0"
              : new Date(data.datetimeutc).getHours()}
          </span>
        ))}
      </div>
      {criteriaDatas?.map((rows: any) => (
        <div key={rows.criteria_name}>
          <span style={{ textAlign: "center" }}>{rows.criteria_name}</span>
          <div className={"mini_color_box"}>
            {datas.map((data: any, index: number) => (
             <span
             key={`${data.datetimeutc}-${index}`}
             style={{ width: "100%" }}
             className={getColor(
                 criteriaDetailDatas,  
                 data,                 
                 rows.forecast_osf_criteria_id.toString() 
             )}
         ></span>
         
            ))}
          </div>
        </div>
      ))}
    </div>
  ))}
</div>

                <div className={"legend_div"}>
                  <span className={"legend_heading"}>Status</span>
                  <div className={"lengend_details_div"}>
                    <div className={"legend_inner_div"}>
                      <span
                        style={{ width: "2.5em" }}
                        className={["high_legend"].join(" ")}
                      ></span>
                      <span className={"legend_content"}>Above the limit</span>
                    </div>
                    <div className={"legend_inner_div"}>
                      <span
                        style={{ width: "2.5em" }}
                        className={["normal_legend"].join(" ")}
                      ></span>
                      <span className={"legend_content"}>Marginal</span>
                    </div>
                    <div className={"legend_inner_div"}>
                      <span
                        style={{ width: "2.5em" }}
                        className={["low_legend"].join(" ")}
                      ></span>
                      <span className={"legend_content"}>Below the limit</span>
                    </div>
                  </div>
                </div>
              </Main>
            ) : loading === false ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "90vh",
                }}
              >
                <p
                  style={{
                    fontSize: "28px",
                    color: "black",
                    backgroundColor: "grey",
                    padding: 10,
                    borderRadius: 6,
                  }}
                >
                  No Data Found
                </p>
              </div>
            ) : null
          ) : (
            <div
              style={{
                width: "100%",
                height: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WeatherLoader />
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}
