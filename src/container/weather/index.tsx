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
        
        const data = {"criteria_datas":
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
