import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import WeatherLoader from "../../components/loader";
import store from "../../store";
import "./styles/_index.scss";
import TableRow from "@mui/material/TableRow";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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

function calculateWindDir(data: number) {
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
  return calc[0][1]; // Return the direction (e.g., "NNE")
}
const ForeCast = () => {
  const windowWidth = useRef(window.innerWidth);
  const [dataTable, setData] = useState("0");
  const [tableColorDatas, setTableColorDatas] = useState<any | object>({});
  const [tableHeader, setTableHeaders] = useState<any>([]);
  const [forecastDatas, setForecastDatas] = useState<any>([]);
  const [TableDatas, setTableDatas] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [selectText, setSelectText] = useState<object | any>({});
  const [inputText, setInputText] = useState<object | any>({});
  const [interval, setInterval] = useState<number>(3);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [loading, setLoading] = useState(true);
  const [discussion, setDiscussion] = useState<any>("");
  const [disDetail, setDisDetail] = useState<any>("");
  const modelvisibility: any = [];
  const [min, setMin] = useState<any>(0);
  const [max, setMax] = useState<any>(0);
  const [overViewColor, setOverViewColor] = useState<any>([]);
  const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
  const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([
    "white",
  ]);
  const [SelectValue, setSelectValue] = useState<any>("");
  const data = useSelector((state: any) => state?.app);
  const [wind, setWind] = useState(0);
  const [windwave, setWindWave] = useState(0);
  const [swell1, setSwell1] = useState(0);
  const [swell2, setSwell2] = useState(0);
  const [total, setTotal] = useState(0);
  const [weather, setWeather] = useState(0);
  const [timestraping, setTimeStraping] = useState([]);
  const [isDirTS, setIsDirTs] = useState<boolean>(false);
  const [isDirWw, setIsDirWw] = useState<boolean>(false);
  const [presentWw, setPreWw] = useState<boolean>(false);
  const [presentS1, setPreS1] = useState<boolean>(false);
  const [presentS2, setPreS2] = useState<boolean>(false);
  const [render, setRender] = useState(false);
  const [tableContent, setTableContent] = useState<any>();
  const [inputRefValue, setInputRefValue] = useState<any>();
  const [height, setHeight] = useState("55vh");
  const [subject, setSubject] = useState<any>("");
  const [validity_a, setValidity_a] = useState<any>("");
  const [validity_b, setValidity_b] = useState<any>("");
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      setHeight("65vh"); // Adjusted height for desktops
    }
  }, []);

  interface Header {
    name: string;
    caption: string;
  }

  const handleDownload = async () => {
    const projectName = localStorage.getItem("project");
    if (projectName) {
      const encodedProjectName = encodeURIComponent(projectName.trim());
      setLoadingPdf(true);
      fetch(
        `${process.env.REACT_APP_BACKEND_IP}api/download-pdf/?projectName=${encodedProjectName}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("No matching PDF found");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${projectName}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => {
          setLoadingPdf(false);
        });
    }
  };
  const handleDownloadCsv = async () => {
    const projectName = localStorage.getItem("project");
    if (projectName) {
      const encodedProjectName = encodeURIComponent(projectName.trim());
      setLoadingCsv(true);
      fetch(
        `${process.env.REACT_APP_BACKEND_IP}api/download_csv/?projectName=${encodedProjectName}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("No matching CSV found");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${projectName}.csv`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => {
          setLoadingCsv(false);
        });
    }
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
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
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_IP}api/overview/`,
          { forecast_id: localStorage.getItem("fid") },
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: "Basic " + btoa("admin:admin"),
            },
          }
        );
        const data = response.data;
        setCriteriaDatas(data.criteria_datas);
        setCriteriaDetailDatas(data.criteria_detail_datas);
        setSelectValue(
          String(data.criteria_detail_datas[0].forecast_osf_criteria_id)
        );
      } catch (error) {
        console.log("Cannot Fetch Table Datas");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded data instead of API call
        const hardcodedData = {
          "headers": [
              {
                  "name": "datetimeutc",
                  "caption": "Time"
              },
              {
                  "name": "peakwaveperiod",
                  "caption": "Peak Wave Period",
                  "field_id": 66,
                  "output_unit_name": "[s]"
              },
              {
                  "name": "a_10mwinddir",
                  "caption": "10m Wind Dir",
                  "field_id": 1,
                  "output_unit_name": "[Cardinals]"
              },
              {
                  "name": "a_10mwindspeed",
                  "caption": "10m Wind Speed",
                  "field_id": 2,
                  "output_unit_name": "[kts]"
              },
              {
                  "name": "a_10mgust",
                  "caption": "10m Gust",
                  "field_id": 3,
                  "output_unit_name": "[kts]"
              },
              {
                  "name": "a_50mwindspeed",
                  "caption": "50m Wind Speed",
                  "field_id": 5,
                  "output_unit_name": "[kts]"
              },
              {
                  "name": "windseaheight",
                  "caption": "Wind Wave Height",
                  "field_id": 47,
                  "output_unit_name": "[m]"
              },
              {
                  "name": "windseaperiod",
                  "caption": "Wind Wave Period",
                  "field_id": 49,
                  "output_unit_name": "[s]"
              },
              {
                  "name": "swell1direction",
                  "caption": "Swell 1 Dir",
                  "field_id": 51,
                  "output_unit_name": "[Cardinals]"
              },
              {
                  "name": "swell1height",
                  "caption": "Swell 1 Height",
                  "field_id": 50,
                  "output_unit_name": "[m]"
              },
              {
                  "name": "swell1period",
                  "caption": "Swell 1 Period",
                  "field_id": 52,
                  "output_unit_name": "[s]"
              },
              {
                  "name": "swell2direction",
                  "caption": "Swell 2 Dir",
                  "field_id": 54,
                  "output_unit_name": "[Cardinals]"
              },
              {
                  "name": "swell2height",
                  "caption": "Swell 2 Height",
                  "field_id": 53,
                  "output_unit_name": "[m]"
              },
              {
                  "name": "swell2period",
                  "caption": "Swell 2 Period",
                  "field_id": 55,
                  "output_unit_name": "[s]"
              },
              {
                  "name": "sigwaveheight",
                  "caption": "Sig Wave Height",
                  "field_id": 62,
                  "output_unit_name": "[m]"
              },
              {
                  "name": "maxwave",
                  "caption": "Max Wave",
                  "field_id": 61,
                  "output_unit_name": "[m]"
              }
          ],
          "datas": [
              [
                  {
                      "datetimeutc": "09/25/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 296.4,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.5,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.51,
                      "maxwave": 0.9
                  },
                  {
                      "datetimeutc": "09/25/2024 21:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 120.2,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.5,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.51,
                      "maxwave": 0.9
                  }
              ],
              [
                  {
                      "datetimeutc": "09/26/2024 00:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 237.9,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.4,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.41,
                      "maxwave": 0.7
                  },
                  {
                      "datetimeutc": "09/26/2024 03:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 249.0,
                      "a_10mwindspeed": 7,
                      "a_10mgust": 9,
                      "a_50mwindspeed": 10,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.4,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.45,
                      "maxwave": 0.8
                  },
                  {
                      "datetimeutc": "09/26/2024 06:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 258.6,
                      "a_10mwindspeed": 8,
                      "a_10mgust": 11,
                      "a_50mwindspeed": 12,
                      "windseaheight": 0.3,
                      "windseaperiod": 1.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.4,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.5,
                      "maxwave": 0.8
                  },
                  {
                      "datetimeutc": "09/26/2024 09:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 218.3,
                      "a_10mwindspeed": 9,
                      "a_10mgust": 12,
                      "a_50mwindspeed": 13,
                      "windseaheight": 0.4,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.5,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.64,
                      "maxwave": 1.1
                  },
                  {
                      "datetimeutc": "09/26/2024 12:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 219.5,
                      "a_10mwindspeed": 9,
                      "a_10mgust": 12,
                      "a_50mwindspeed": 13,
                      "windseaheight": 0.4,
                      "windseaperiod": 3.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.5,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.64,
                      "maxwave": 1.1
                  },
                  {
                      "datetimeutc": "09/26/2024 15:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 237.3,
                      "a_10mwindspeed": 8,
                      "a_10mgust": 10,
                      "a_50mwindspeed": 11,
                      "windseaheight": 0.3,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.5,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.58,
                      "maxwave": 1.0
                  },
                  {
                      "datetimeutc": "09/26/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 245.7,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 8,
                      "a_50mwindspeed": 9,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.4,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.45,
                      "maxwave": 0.8
                  },
                  {
                      "datetimeutc": "09/26/2024 21:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 237.3,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  }
              ],
              [
                  {
                      "datetimeutc": "09/27/2024 00:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 238.3,
                      "a_10mwindspeed": 3,
                      "a_10mgust": 4,
                      "a_50mwindspeed": 5,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 03:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 264.0,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 06:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 261.7,
                      "a_10mwindspeed": 3,
                      "a_10mgust": 4,
                      "a_50mwindspeed": 4,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 09:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 185.0,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 12:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 201.1,
                      "a_10mwindspeed": 7,
                      "a_10mgust": 10,
                      "a_50mwindspeed": 11,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.36,
                      "maxwave": 0.6
                  },
                  {
                      "datetimeutc": "09/27/2024 15:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 225.5,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 8,
                      "a_50mwindspeed": 9,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 247.4,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 8,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.3,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/27/2024 21:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 252.5,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.2,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  }
              ],
              [
                  {
                      "datetimeutc": "09/28/2024 00:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 244.7,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.2,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/28/2024 03:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 241.5,
                      "a_10mwindspeed": 3,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 5,
                      "windseaheight": 0.1,
                      "windseaperiod": 1.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.2,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/28/2024 06:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 244.4,
                      "a_10mwindspeed": 3,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 5,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/28/2024 09:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 200.2,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/28/2024 12:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 185.9,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 8,
                      "a_50mwindspeed": 9,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/28/2024 15:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 241.8,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 8,
                      "a_50mwindspeed": 8,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/28/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 268.7,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 8,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/28/2024 21:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 272.6,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 1.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  }
              ],
              [
                  {
                      "datetimeutc": "09/29/2024 00:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 300.4,
                      "a_10mwindspeed": 3,
                      "a_10mgust": 4,
                      "a_50mwindspeed": 4,
                      "windseaheight": 0.1,
                      "windseaperiod": 1.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/29/2024 03:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 303.7,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/29/2024 06:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 304.7,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/29/2024 09:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 302.1,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/29/2024 12:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 265.1,
                      "a_10mwindspeed": 4,
                      "a_10mgust": 5,
                      "a_50mwindspeed": 6,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/29/2024 15:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 269.3,
                      "a_10mwindspeed": 7,
                      "a_10mgust": 9,
                      "a_50mwindspeed": 10,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/29/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 272.7,
                      "a_10mwindspeed": 7,
                      "a_10mgust": 10,
                      "a_50mwindspeed": 11,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/29/2024 21:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 269.2,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 8,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  }
              ],
              [
                  {
                      "datetimeutc": "09/30/2024 00:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 257.5,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 6,
                      "a_50mwindspeed": 7,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/30/2024 03:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 234.7,
                      "a_10mwindspeed": 6,
                      "a_10mgust": 8,
                      "a_50mwindspeed": 9,
                      "windseaheight": 0.1,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.14,
                      "maxwave": 0.2
                  },
                  {
                      "datetimeutc": "09/30/2024 06:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 236.4,
                      "a_10mwindspeed": 7,
                      "a_10mgust": 9,
                      "a_50mwindspeed": 10,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/30/2024 09:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 231.2,
                      "a_10mwindspeed": 5,
                      "a_10mgust": 7,
                      "a_50mwindspeed": 8,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/30/2024 12:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 254.2,
                      "a_10mwindspeed": 8,
                      "a_10mgust": 10,
                      "a_50mwindspeed": 11,
                      "windseaheight": 0.2,
                      "windseaperiod": 2.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.22,
                      "maxwave": 0.4
                  },
                  {
                      "datetimeutc": "09/30/2024 15:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 261.2,
                      "a_10mwindspeed": 9,
                      "a_10mgust": 12,
                      "a_50mwindspeed": 13,
                      "windseaheight": 0.3,
                      "windseaperiod": 3.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.1,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.32,
                      "maxwave": 0.5
                  },
                  {
                      "datetimeutc": "09/30/2024 18:00",
                      "peakwaveperiod": 6.0,
                      "a_10mwinddir": 256.6,
                      "a_10mwindspeed": 9,
                      "a_10mgust": 12,
                      "a_50mwindspeed": 13,
                      "windseaheight": 0.3,
                      "windseaperiod": 3.0,
                      "swell1direction": 292.5,
                      "swell1height": 0.2,
                      "swell1period": 6.0,
                      "swell2direction": 0,
                      "swell2height": 0.0,
                      "swell2period": 0,
                      "sigwaveheight": 0.36,
                      "maxwave": 0.6
                  }
              ]
          ],
          "interval": 3,
          "total": 41,
          "discussion": {
              "discussion": {
                  "discussion_id": 311242,
                  "synopsis": "A low pressure centred over east Vietnam waters extends a tight trough NE'wards to Hainan, SE China waters and Taiwan Strait. A broad and relatively lower pressure trough lies from the Gulf of Thailand, across Natuna Sea to west Borneo waters.",
                  "warning": "MODERATE TO HIGH RISKS OF SQUALLS OF 20-35 KNOTS IN/NEAR SHOWERS AND THUNDERSTORMS WITH TEMPORARILY RAISED SEAS DURING OCCURRENCE.",
                  "advisory": "",
                  "notes": "Partly cloudy to cloudy periods with chance of showers with thunderstorms possible."
              },
              "discussion_detail": null,
              "subject": {
                  "vessel_rig_platform_name": "AEGIR ROSMARI",
                  "field_area_name": "MARJORAM"
              },
              "validity_a": [
                  {
                      "time_block": 120,
                      "forecast_time_table_step_id": 6862,
                      "forecast_id": 8499,
                      "interval": 3,
                      "created_by": 22,
                      "created_on": "2024-09-04T12:47:21.997601",
                      "updated_by": 20,
                      "updated_on": "2024-09-20T04:33:27.316965",
                      "last_accessed_on": "2024-09-20T04:33:27.325890"
                  }
              ],
              "validity_b": {
                  "issue_date_time": "2024-09-25T18:00:00",
                  "duty_list_task_id": 83873297,
                  "forecast_id": 8499,
                  "shift_id": 15,
                  "status_id": 5,
                  "send_date_time": "2024-09-25T09:00:00",
                  "created_on": "2024-09-04T12:47:25",
                  "created_by": 22,
                  "updated_by": 23,
                  "updated_on": "2024-09-25T07:05:08.980999",
                  "sent_on": "2024-09-25T09:00:46.967544",
                  "sent_by": 23,
                  "longitude": 112.93,
                  "latitude": 5.15,
                  "is_fixed_site": true,
                  "route_id": 1029,
                  "region_id": 4,
                  "day_offset": 0,
                  "nearest_lat": null,
                  "nearest_long": null,
                  "is_nearest_grid_points": false,
                  "allow_conditional_limit": false,
                  "conditional_limit_margin_val": null,
                  "is_manual": false,
                  "is_discussion_task": false,
                  "last_accessed_on": "2024-09-25T09:00:46.960688",
                  "is_auto": false,
                  "skipped_by": null,
                  "skipped_on": null,
                  "email_addresses": null,
                  "orginal_issue_time": null,
                  "orginal_send_time": null
              }
          },
          "subheaders": [
              {
                  "wind": 4
              },
              {
                  "windwave": 2
              },
              {
                  "swell1": 3
              },
              {
                  "swell2": 3
              },
              {
                  "total": 3
              },
              {
                  "weather": 0
              }
          ]}
        setTableHeaders(hardcodedData.headers);
        setForecastDatas(hardcodedData.datas);
        setTableDatas(hardcodedData.datas);
        setInterval(hardcodedData.interval);
        setDiscussion(hardcodedData.discussion.discussion);
        setDisDetail(hardcodedData.discussion.discussion_detail);
        setSubject(hardcodedData.discussion.subject);
        setValidity_a(hardcodedData.discussion.validity_a);
        setValidity_b(hardcodedData.discussion.validity_b);
        const wind = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('wind'))?.wind || 0;
        const windWave = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('windwave'))?.windwave || 0;
        const swell1 = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('swell1'))?.swell1 || 0;
        const swell2 = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('swell2'))?.swell2 || 0;
        const total = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('total'))?.total || 0;
        const weather = hardcodedData.subheaders.find(sub => sub.hasOwnProperty('weather'))?.weather || 0;

        setWind(wind);
        setWindWave(windWave);
        setSwell1(swell1);
        setSwell2(swell2);
        setTotal(total);
        setWeather(weather);
        setLoading(false);
      } catch (error) {
        console.log("Cannot Fetch Table Data", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    var datas = TableDatas;
    TableDatas.map((date: any) => {
      date.map((element: any) => {
        setOverViewColor((prevOverViewColor: any) => [
          ...prevOverViewColor,
          "red_overview",
        ]);
      });
    });
    datas.forEach((element: any) => {
      element.forEach((ele: any) => {
        ele.modelvisibility !== undefined
          ? modelvisibility.push(ele.modelvisibility)
          : modelvisibility.push(0);
      });
    });
    setMin(Math.floor(Math.min(...modelvisibility)));
    setMax(Math.floor(Math.max(...modelvisibility)));
  }, [TableDatas]);

  useEffect(() => {
    for (const key of timestraping) {
      if (selectText[key] === undefined)
        analysetheData(key, inputText[key], ">=");
      else analysetheData(key, inputText[key], selectText[key]);
    }
  }, [timestraping, TableDatas]);

  function getColor(data: number) {
    let criteria: any = {};
    let fieldId2: any = {};
    let fieldId62: any = {};
    let operatorId: number | undefined;
    criteriaDetailDatas.forEach((c_data: any) => {
      if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
        criteria = c_data;
        if (c_data.field_id === 2) {
          fieldId2 = c_data;
        } else if (c_data.field_id === 62) {
          fieldId62 = c_data;
        }
        operatorId = c_data.comparison_operator_id;
      }
    });
    let isAndOperator = operatorId === 2;
    let isField2Green = data <= fieldId2.margin_value;
    let isField2Yellow = data > fieldId2.margin_value && data <= criteria.value;
    let isField2Red = data > criteria.value;
    let isField62Green = data <= fieldId62.margin_value;
    let isField62Yellow =
      data > fieldId62.margin_value && data <= criteria.value;
    let isField62Red = data > criteria.value;
    if (
      (isField2Green && isField62Green && isAndOperator) ||
      isField2Green ||
      (isField62Green && !isAndOperator)
    ) {
      return "green_overview";
    } else if (
      (isField2Yellow && isField62Yellow && isAndOperator) ||
      isField2Yellow ||
      (isField62Yellow && !isAndOperator)
    ) {
      return "yellow_overview";
    } else {
      return "red_overview";
    }
  }
  function analysetheData(arg: string, text: string, mode: string) {

    let table: any = { ...tableColorDatas };
    for (const data in table) {
        if (data.slice(6, data.lastIndexOf("_")) === arg) {
            delete table[data];
        }
    }


    const inputValue = parseFloat(text);
    let total_index = 0;
    TableDatas.forEach((datas: any) => {
        for (const eachinner in datas) {
            let boolean_value = false;
            let color = "white";  
            const dataValue = parseFloat(datas[eachinner][arg]);
            if (mode === ">=" && !isNaN(dataValue)) {
                if (dataValue >= inputValue) {
                    color = "green";  
                    boolean_value = true;
                }
            } else if (mode === "<=" && !isNaN(dataValue)) {
                if (dataValue <= inputValue) {
                    color = "red"; 
                    boolean_value = true;
                }
            }

            table["color_" + arg + "_" + total_index] = color;
            total_index += 1;
        }
    });


    const newColorArray: any = [];
    setOverViewColor([]);

    TableDatas.forEach((date: any) => {
        date.forEach((element: any) => {
            let data = parseFloat(element.a_10mwindspeed); 
            let color = "white";  
            let criteria: any = {};

            criteriaDetailDatas.forEach((c_data: any) => {
                if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
                    criteria = c_data;
                }
            });

            if ((data >= criteria.value && data <= criteria.margin_value) || 
                (data <= criteria.value && data >= criteria.margin_value)) {
                color = "yellow_overview";
            } else if (data > criteria.value && data > criteria.margin_value) {
                color = "red_overview";
            } else if (data < criteria.value && data < criteria.margin_value) {
                color = "green_overview";
            }

            newColorArray.push(color);
        });
    });

    
    setOverViewColor(newColorArray);
    setTableColorDatas(table);
    setTableContent(ScrapeDatas2().map((d: any) => d));
}

  function analysetheFreq(arg: string[], text: string, mode: string) {
    const direction = [
      "a_10winddir",
      "windseadirection",
      "swell1direction",
      "swell2direction",
      "surfacecurrentdirection",
    ];
    let table: any = { ...tableColorDatas };
    arg.forEach((element) => {
      for (const s in inputText) {
        if (!direction.includes(element) && element === s) {
          // Remove the existing data
          for (const data in table) {
            if (data.slice(6, data.lastIndexOf("_")) === element) {
              delete table[data];
            }
          }
          let total_index = 0;
          TableDatas.forEach((datas: any) => {
            for (const eachinner in datas) {
              let boolean_value = false;
              let color = null;
              if (mode === ">=") {
                color = "green";
                boolean_value =
                  parseFloat(datas[eachinner][element]) >=
                  parseFloat(inputText[s]);
              } else if (mode === "<=") {
                color = "red";
                boolean_value =
                  parseFloat(datas[eachinner][element]) <=
                  parseFloat(inputText[s]);
              }
              if (boolean_value) {
                table["color_" + element + "_" + total_index] = color;
              } else {
                table["color_" + element + "_" + total_index] = "white";
              }
              total_index += 1;
            }
          });
        }
      }
    });
    const newColorArray: any = [];
    setOverViewColor([]);
    TableDatas.forEach((date: any) => {
      date.forEach((element: any) => {
        let data = parseFloat(element.a_10mwindspeed);
        var criteria: any = {};
        criteriaDetailDatas.forEach((c_data: any) => {
          if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
            criteria = c_data;
          }
        });
        if (
          (data >= criteria.value && data <= criteria.margin_value) ||
          (data <= criteria.value && data >= criteria.margin_value)
        ) {
          let color = "yellow_overview";
          newColorArray.push(color);
        } else if (data > criteria.value && data > criteria.margin_value) {
          let color = "red_overview";
          newColorArray.push(color);
        } else if (data < criteria.value && data < criteria.margin_value) {
          let color = "green_overview";
          newColorArray.push(color);
        } else {
          newColorArray.push("white");
        }
      });
    });
    setOverViewColor((prev: any) => newColorArray);
    setTableColorDatas((prev: any) => table);
    setTableContent(ScrapeDatas2().map((d: any) => d));
  }


  function Dateformat(celldata: any) {
    const dateObject = new Date(celldata);
    const inputDate = dateObject;
    const dayc = dayNames[inputDate.getDay()];
    const monthc = monthNames[inputDate.getMonth()];
    const yearc = inputDate.getFullYear();
    return `${dayc}, ${inputDate.getDate()} ${monthc} ${yearc}`;
  }

  useEffect(() => {
    const newColorArray: any = [];
    setOverViewColor([]);
    TableDatas.forEach((date: any) => {
      date.forEach((element: any) => {
        let data = parseFloat(element.a_10mwindspeed);
        let color = getColor(data); // integrating getColor function here
        newColorArray.push(color);
      });
    });
    setOverViewColor(newColorArray);
  }, [SelectValue]);

  useEffect(() => {
    const newColorArray: any = [];
    TableDatas.forEach((date: any) => {
      date.forEach((element: any) => {
        let data = parseFloat(element.a_10mwindspeed);
        var criteria: any = {};
        criteriaDetailDatas.forEach((c_data: any) => {
          if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
            criteria = c_data;
          }
        });
        let color = getColor(data);
        newColorArray.push(color);
      });
    });
    setOverViewColor(newColorArray);
  }, []);

  useEffect(() => {
    const newColorArray: any = [];
    TableDatas.forEach((date: any) => {
      date.forEach((element: any) => {
        let data = parseFloat(element.a_10mwindspeed);
        var criteria: any = {};
        criteriaDetailDatas.forEach((c_data: any) => {
          if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
            criteria = c_data;
          }
        });
        let color = getColor(data);
        newColorArray.push(color);
      });
    });
    setOverViewColor(newColorArray);
  }, [TableDatas]);

  useEffect(() => {
    setTableContent(ScrapeDatas2().map((d: any) => d));
  }, [overViewColor]);

  function getCompassDirection(value: number): string {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(value / 22.5) % 16;
    return directions[index];
  }


  let incr = 0;
  function ScrapeDatas(datas: any, index: number) {
    let total_index = index;
    var dict: any = [];
    var dates: any = [];
    let tmpdir: any;
    for (const data_array in datas) {
      var dict_temp: any = [];
      // Date
      let first = true;
      let dayformat = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "datetimeutc") {
          var weatherDate = new Date(cellData + " UTC");
          let groupDate = new Date(weatherDate);
          groupDate.setUTCHours(0, 0, 0, 0);
          if (
            !dates.some((date: Date) => date.getTime() === groupDate.getTime())
          ) {
            dates.push(groupDate);
            dict.push(
              <tr>
                <td
                  style={{
                    textAlign: "center",
                    fontWeight: "500",
                    borderTop: "1px solid #437c92",
                    maxHeight: "4px",
                    borderBottom: "1px solid #437c92",
                    borderRight: "0.5px solid gray",
                  }}
                  key={Math.random()}
                  colSpan={100}
                >
                  {cellData === null || cellData === undefined
                    ? "-"
                    : Dateformat(groupDate)}
                  {(dayformat = false)}
                </td>
              </tr>
            );
          }
          dict_temp.push(
            <td
              style={{
                borderRight: "0.5px solid gray",
                textAlign: "center",
              }}
              className={`${
                tableColorDatas["color_" + data + "_" + total_index] ===
                undefined
                  ? "-"
                  : tableColorDatas["color_" + data + "_" + total_index]
              }`}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      marginLeft: "8px",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "3px",
                    }}
                    className={overViewColor[incr]}
                  ></div>
                  {`${weatherDate.getUTCDate()}/${weatherDate
                    .toISOString()
                    .slice(11, 13)}${weatherDate.toISOString().slice(14, 16)}`}
                </div>
              )}
            </td>
          );
        }
      }
      // Wind direction
      for (let data in datas[data_array]) {
        let cellData: any = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
          tmpdir = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (data === "a_10mwinddir") {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <td
                style={{
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    >
                      {cellData.slice(10)}
                    </div>
                  </div>
                ) : (
                  cellData
                )}
              </td>
            );
          }
        }
      }
      // Wind
      for (let data in datas[data_array]) {
        let cellData: any = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
          tmpdir = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (
          data === "a_10mwindspeed" ||
          data === "a_10mgust" ||
          data === "a_50mwindspeed" ||
          data === "a_80mwindspeed" ||
          data === "a_100mwindspeed"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <td
                style={{
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    >
                      {cellData.slice(10)}
                    </div>
                  </div>
                ) : data === "a_10mwindspeed" ||
                  data === "a_10mgust" ||
                  data === "a_50mwindspeed" ||
                  data === "a_80mwindspeed" ||
                  data === "a_100mwindspeed" ? (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                    >
                      <p
                        className={`${
                          tableColorDatas[
                            "color_" + data + "_" + total_index
                          ] === undefined
                            ? "-"
                            : tableColorDatas[
                                "color_" + data + "_" + total_index
                              ]
                        }`}
                      >
                        {Math.floor(cellData)}
                      </p>
                    </div>
                  </>
                ) : (
                  cellData
                )}
              </td>
            );
          }
        }
      }

      first = true;
      let directionWw = false;

      // Direction of windwave
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
          tmpdir = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (data === "a_10mwinddir") {
          // eslint-disable-next-line no-lone-blocks
          {
            directionWw = true;
            setPreWw(true);
            dict_temp.push(
              <td
                style={{
                  borderLeft: "0.5px solid #437c92",
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    {cellData.slice(10)}
                  </div>
                ) : (
                  <>{cellData}</>
                )}
              </td>
            );
          }
        }
      }

      if (directionWw === false) {
        setIsDirWw(true);
        for (let data in datas[data_array]) {
          let cellData = datas[data_array][data];
          if (data === "a_10mwinddir") {
            cellData = calculateWindDir(datas[data_array][data]);
            tmpdir = calculateWindDir(datas[data_array][data]);
          }
          if (
            data === "modelvisibility" ||
            data === "cloudbase" ||
            data === "rainrate"
          ) {
            continue;
          }
          if (data === "datetimeutc") {
            // eslint-disable-next-line no-lone-blocks
            {
              directionWw = true;
              dict_temp.push(
                <td
                  style={{
                    borderLeft: "0.5px solid #437c92",
                    borderRight: `${""}`,
                    textAlign: "center",
                  }}
                  key={Math.random()}
                >
                  <></>
                </td>
              );
            }
          }
        }
      }
      // Windwaves
      first = false;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "windseaheight" || data === "windseaperiod") {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <td
                style={{
                  borderLeft: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    >
                      {cellData.slice(10)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        className={`${
                          tableColorDatas[
                            "color_" + data + "_" + total_index
                          ] === undefined
                            ? "-"
                            : tableColorDatas[
                                "color_" + data + "_" + total_index
                              ]
                        }`}
                      >
                        {Number(cellData) % 1 === 0
                          ? cellData
                          : Number(cellData).toFixed(1)}
                      </p>
                    </div>
                  </>
                )}
                {(first = false)}
              </td>
            );
          }
        }
      }

      // Swell 1
      first = true;
      let directionS1 = false;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
          tmpdir = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (data === "swell1direction") {
          directionS1 = true;
          let swellDirection = datas[data_array][data];
          dict_temp.push(
            <td
              style={{
                borderLeft: "0.5px solid #437c92",
                borderRight: `${""}`,
                textAlign: "center",
              }}
              key={Math.random()}
            >
              {swellDirection === null || swellDirection === undefined ? (
                "-"
              ) : swellDirection === 0 ? (
                "0"
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span>{calculateWindDir(swellDirection)}</span>
                </div>
              )}
            </td>
          );
        }
      }
      if (directionS1 === false) {
        setPreS1(true);
        for (let data in datas[data_array]) {
          let cellData = datas[data_array][data];
          if (data === "a_10mwinddir") {
            cellData = calculateWindDir(datas[data_array][data]);
            tmpdir = calculateWindDir(datas[data_array][data]);
          }
          if (
            data === "modelvisibility" ||
            data === "cloudbase" ||
            data === "rainrate"
          ) {
            continue;
          }
          if (data === "datetimeutc") {
            dict_temp.push(
              <td
                style={{
                  borderLeft: "0.5px solid #437c92",
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                <></>
              </td>
            );
          }
        }
      }
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "swell1height" || data === "swell1period") {
          dict_temp.push(
            <td
              style={{
                textAlign: "center",
              }}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : cellData === 0 ? (
                "0"
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "3px",
                  }}
                >
                  <p
                    className={`${
                      tableColorDatas["color_" + data + "_" + total_index] ===
                      undefined
                        ? "-"
                        : tableColorDatas["color_" + data + "_" + total_index]
                    }`}
                  >
                    {Number(cellData) % 1 === 0
                      ? cellData
                      : Number(cellData).toFixed(1)}
                  </p>
                </div>
              )}
              {(first = false)}
            </td>
          );
        }
      }

      // Swell 2
      // Swell 2
      first = true;
      let directionS2 = false;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "swell2direction") {
          directionS2 = true;
          dict_temp.push(
            <td
              style={{
                borderLeft: `${first === true ? "0.5px solid gray" : ""}`,
                textAlign: "center",
              }}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : cellData === 0 ? (
                "0"
              ) : (
                <>
                  <div
                    style={{
                      width: "100%",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <p
                      className={`${
                        tableColorDatas["color_" + data + "_" + total_index] ===
                        undefined
                          ? "-"
                          : tableColorDatas["color_" + data + "_" + total_index]
                      }`}
                    >
                      {getCompassDirection(Number(cellData))}
                    </p>
                  </div>
                </>
              )}
              {(first = false)}
            </td>
          );
        }
      }
      if (directionS2 === false && swell2 !== 0) {
        setPreS2(true);
        for (let data in datas[data_array]) {
          let cellData = datas[data_array][data];
          if (data === "a_10mwinddir") {
            cellData = calculateWindDir(datas[data_array][data]);
            tmpdir = calculateWindDir(datas[data_array][data]);
          }
          if (
            data === "modelvisibility" ||
            data === "cloudbase" ||
            data === "rainrate"
          ) {
            continue;
          }
          if (data === "datetimeutc") {
            dict_temp.push(
              <td
                style={{
                  borderLeft: "0.5px solid #437c92",
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                <></>
              </td>
            );
          }
        }
      }
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "swell2height" || data === "swell2period") {
          dict_temp.push(
            <td
              style={{
                borderLeft: `${first === true ? "0.5px solid gray" : ""}`,
                textAlign: "center",
              }}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : (
                <>
                  <div
                    style={{
                      width: "100%",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "3px",
                    }}
                  >
                    <p
                      className={`${
                        tableColorDatas["color_" + data + "_" + total_index] ===
                        undefined
                          ? "-"
                          : tableColorDatas["color_" + data + "_" + total_index]
                      }`}
                    >
                      {Number(cellData) % 1 === 0
                        ? cellData
                        : Number(cellData).toFixed(1)}
                    </p>
                  </div>
                </>
              )}
              {(first = false)}
            </td>
          );
        }
      }

      first = true;
      let directionTS = false;
      // Direction of Totalsea
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
          tmpdir = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (data === "surfacecurrentdirection") {
          // eslint-disable-next-line no-lone-blocks
          {
            directionTS = true;
            dict_temp.push(
              <td
                style={{
                  borderLeft: "0.5px solid #437c92",
                  borderRight: `${""}`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    >
                      {cellData.slice(10)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                      className={`${
                        tableColorDatas["color_" + data + "_" + total_index] ===
                        undefined
                          ? "-"
                          : tableColorDatas["color_" + data + "_" + total_index]
                      }`}
                    >
                      {Number(cellData) % 1 === 0
                        ? cellData
                        : Number(cellData).toFixed(1)}
                    </div>
                  </>
                )}
              </td>
            );
          }
        }
      }

      if (directionTS === false) {
        setIsDirTs(true);
        for (let data in datas[data_array]) {
          let cellData = datas[data_array][data];
          if (data === "a_10mwinddir") {
            cellData = calculateWindDir(datas[data_array][data]);
            tmpdir = calculateWindDir(datas[data_array][data]);
          }
          if (
            data === "modelvisibility" ||
            data === "cloudbase" ||
            data === "rainrate"
          ) {
            continue;
          }
          if (data === "datetimeutc") {
            // eslint-disable-next-line no-lone-blocks
            {
              directionTS = true;
              dict_temp.push(
                <td
                  style={{
                    borderLeft: "0.5px solid #437c92",
                    borderRight: `${""}`,
                    textAlign: "center",
                  }}
                  className={`${
                    tableColorDatas["color_" + data + "_" + total_index] ===
                    undefined
                      ? "-"
                      : tableColorDatas["color_" + data + "_" + total_index]
                  }`}
                  key={Math.random()}
                >
                  <></>
                </td>
              );
            }
          }
        }
      }

      // first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        // eslint-disable-next-line no-mixed-operators
        if (
          data === "sigwaveheight" ||
          data === "maxwave" ||
          (data !== "datetime" &&
            data !== "surfacecurrentdirection" &&
            data !== "a_10mwinddir" &&
            data !== "a_10mwindspeed" &&
            data !== "a_10mgust" &&
            data !== "a_50mwindspeed" &&
            data !== "a_80mwindspeed" &&
            data !== "a_100mwindspeed" &&
            data !== "windseadirection" &&
            data !== "windseaheight" &&
            data !== "swell1direction" &&
            data !== "swell1height" &&
            data !== "swell1period" &&
            data !== "swell2direction" &&
            data !== "swell2height" &&
            data !== "swell2period" &&
            data !== "rainrate" &&
            data !== "cloudbase" &&
            data !== "modelvisibility" &&
            data !== "windseaperiod" &&
            data !== "datetimeutc")
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <td
                style={{
                  borderLeft: `${
                    first === true && data === "sigwaveheight"
                      ? "0.5px solid gray"
                      : ""
                  }`,
                  textAlign: "center",
                }}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div className={`${overViewColor[incr]} tableContent`}>
                      {cellData.slice(10)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100%",
                        height: "20px",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "3px",
                      }}
                    >
                      <p
                        className={`${
                          tableColorDatas[
                            "color_" + data + "_" + total_index
                          ] === undefined
                            ? "-"
                            : tableColorDatas[
                                "color_" + data + "_" + total_index
                              ]
                        }`}
                      >
                        {Number(cellData) % 1 === 0
                          ? cellData
                          : Number(cellData).toFixed(1)}
                      </p>
                    </div>
                  </>
                )}
                {(first = false)}
              </td>
            );
          }
        }
      }
      // Weather
      first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          dict_temp.push(
            <td
              style={{
                borderLeft: `${first === true ? "0.5px solid gray" : ""}`,
                textAlign: "center",
              }}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : typeof cellData === "string" && cellData.length === 16 ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div className={`${overViewColor[incr]} tableContent`}>
                    {cellData.slice(10)}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: "100%",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "3px",
                    }}
                    className={`${
                      tableColorDatas["color_" + data + "_" + total_index] ===
                      undefined
                        ? "-"
                        : tableColorDatas["color_" + data + "_" + total_index]
                    }`}
                  >
                    {Math.floor(cellData)}
                  </div>
                </>
              )}
              {(first = false)}
            </td>
          );
        }
      }
      dict.push(
        <tr
          style={{ background: `${incr % 2 === 0 ? "#ADD8E6" : "#FFFFFFF"}` }}
          key={Math.random()}
          className="tabledetail"
        >
          {dict_temp.map((s: any) => s)}
        </tr>
      );
      total_index += 1;
      incr += 1;
    }
    return dict;
  }

  function ScrapeDatas2() {
    let total_index = 0;
    let dict: any = [];
    setSelectValue((prev: any) => prev);
    TableDatas.forEach((data: any) => {
      ScrapeDatas(data, total_index).forEach((d: any) => {
        dict.push(d);
        total_index += 1;
      });
      total_index -= 1;
    });
    return dict;
  }

  const handleChange = (event: SelectChangeEvent<typeof dataTable>) => {
    setData(event.target.value);
    // setTableColorDatas({});
    if (parseInt(event.target.value) === 0) {
      setTableDatas(forecastDatas);
      return;
    }
    var dict: any = [];
    forecastDatas.forEach((datas: any) => {
      var dict_temp: any = [];
      for (const data_array in datas) {
        let datetimeobj: any = new Date(datas[data_array].datetimeutc);
        if (datetimeobj.toString() === "Invalid Date") {
          const d = datas[data_array].datetimeutc.split("/");
          const date = d.shift();
          const month = d.shift();
          d.unshift(date);
          d.unshift(month);
          datetimeobj = new Date(d.join("/"));
        }
        datetimeobj = datetimeobj.getHours();
        if (datetimeobj === 0) {
          datetimeobj = 24;
        }
        if (parseInt(event.target.value) === 0) {
          dict_temp.push(datas[data_array]);
        } else if (
          datetimeobj % parseInt(event.target.value) === 0 &&
          datetimeobj !== 0
        ) {
          dict_temp.push(datas[data_array]);
        }
      }
      dict.push(dict_temp);
    });
    let nameArray = new Array();
    for (const key in tableColorDatas) {
      let name = key.slice(6, key.lastIndexOf("_"));
      nameArray.push(name);
    }
    const name: any = Array.from(new Set(nameArray));
    setTableDatas(dict);
    setTimeStraping(name);
    setPage(0);
  };

  function TableValue(props: any) {
    let windcolumn = [
      "a_10mgust",
      "a_10mwindspeed",
      "a_50mwindspeed",
      "a_80mwindspeed",
      "a_100mwindspeed",
      "a_10mwinddir",
    ];
    let wavecolumn = ["windseadirection", "windseaheight", "windseaperiod"];

    let swell1coln = ["swell1height", "swell1direction", "swell1period"];
    let swell2coln = ["swell2height", "swell2direction", "swell2period"];

    let totalcoln = ["sigwaveheight", "maxwave", "surfacecurrentdirection"];

    const inputRef = useRef<any>(null);
    if (props.name === "a_10mwindspeed") {
      inputRef?.current?.focus();
    }
    const [localInputText, setLocalInputText] = useState(
      inputText[props.name] === undefined ? "" : inputText[props.name]
    );
    const [localSelect, setLocalSelect] = useState(
      selectText[props.name] === undefined ? ">=" : selectText[props.name]
    );

    const handleSymbol = (event: any) => {
      const newSymbol = event.target.value;
      let select = { ...selectText };
  
      if (windcolumn.includes(props.name)) {
        windcolumn.forEach((element) => {
          select[element] = newSymbol;
        });
      } else if (wavecolumn.includes(props.name)) {
        wavecolumn.forEach((element) => {
          select[element] = newSymbol;
        });
      } else if (swell1coln.includes(props.name)) {
        swell1coln.forEach((element) => {
          select[element] = newSymbol;
        });
      } else if (swell2coln.includes(props.name)) {
        swell2coln.forEach((element) => {
          select[element] = newSymbol;
        });
      } else if (totalcoln.includes(props.name)) {
        totalcoln.forEach((element) => {
          select[element] = newSymbol;
        });
      }
      setSelectText(select);
      if (localSelect !== newSymbol) {
        setLocalSelect(newSymbol);
        updateAgain(props.name, newSymbol);
      }
    };
    
    const updateAgain = (name: any, mode: any) => {
      if (windcolumn.includes(name)) {
        analysetheFreq(windcolumn, inputText, mode);
      } else if (wavecolumn.includes(name)) {
        analysetheFreq(wavecolumn, inputText, mode);
      } else if (swell1coln.includes(name)) {
        analysetheFreq(swell1coln, inputText, mode);
      } else if (swell2coln.includes(name)) {
        analysetheFreq(swell2coln, inputText, mode);
      } else if (totalcoln.includes(name)) {
        analysetheFreq(totalcoln, inputText, mode);
      }
    };
    
    const handleInputChange = (event: any) => {
      setInputText((prevInputText: any) => ({
        ...prevInputText,
        [props.name]: event.target.value,
      }));
      setLocalInputText(event.target.value);
      setInputRefValue(props.name);
      analysetheData(props.name, event.target.value, localSelect);
      setRender((prev: any) => !prev);
      setFocus();
    };

    
    const setFocus = () => {
      let inputHandler = inputRef.current;
      if (inputHandler) {
        inputHandler.focus();
      }
    };

    
    return (
      <div
        className={
          props.name === "a_10mwinddir" ||
          props.name === "windseadirection" ||
          props.name === "swell1direction" ||
          props.name === "swell2direction" ||
          props.name === "surfacecurrentdirection"
            ? "rangediv"
            : "tableTitlediv"
        }
      >
        {props.name !== "datetimeutc" ? (
          <>
            <div
              className={
                props.name === "a_10mwinddir" ||
                props.name === "windseadirection" ||
                props.name === "swell1direction" ||
                props.name === "swell2direction" ||
                props.name === "surfacecurrentdirection"
                  ? "selection"
                  : "tableButtons"
              }
              style={{
                opacity: props.caption === "10m Wind Dir" ? 0 : 1,
              }}
            >
              {props.name === "a_10mwinddir" ||
              props.name === "windseadirection" ||
              props.name === "swell1direction" ||
              props.name === "swell2direction" ||
              props.name === "surfacecurrentdirection" ? (
                <>
                 <select
                    value={localSelect}
                    onChange={(text) => handleSymbol(text)}
                  >
                    <option value="<=">{"<="}</option>
                    <option value=">=">{">="}</option>
                  </select>
                </>
              ) : props.name === "modelvisibility" ||
                props.name === "cloudbase" ||
                props.name === "rainrate" ? (
                <>
                  <br />
                </>
              ) : (
                <>
                  <input
                    style={{ display: "" }}
                    value={localInputText}
                    type="number"
                    autoFocus={props.name === inputRefValue ? true : false}
                    onChange={handleInputChange} // Call handleInputChange here
                  ></input>
                </>
              )}
            </div>
          </>
        ) : props.name === "datetimeutc" ? (
          <>LIMIT</>
        ) : (
          <></>
        )}
      </div>
    );
  }

  function TableUnit(props: any) {
    let text;
    switch (props.caption) {
      case "Dir":
        text = "[°]";
        break;
      case "Ws10m":
        text = "[kn]";
        break;
      case "Wg10m":
        text = "[kn]";
        break;
      case "Wg50m":
        text = "[kn]";
        break;
      case "Ws50m":
        text = "[kn]";
        break;
      case "Ws100m":
        text = "[kn]";
        break;
      case "Hs":
        text = "[m]";
        break;
      case "Peak Wave Period":
        text = "[s]";
        break;
      case "Ts":
        text = "[s]";
        break;
      case "Hmax":
        text = "[m]";
        break;
      case "Tp":
        text = "[s]";
        break;
      case "Vis":
        text = "[km]";
        break;
      case "CB":
        text = "[ft]";
        break;
      case "Prec":
        text = "[mm/hr]";
        break;
      case "Sp":
        text = "[s]";
        break;
      case "(GMT+8)":
        text = "date";
        break;
      default:
        text = props.caption;
    }
    return (
      <>
        <span className={"tableTitle"}>{text === "date" ? <br /> : text}</span>
      </>
    );
  }

  function TableTitle(props: any) {
    const [localInputText, setLocalInputText] = useState(
      inputText[props.name] === undefined ? "" : inputText[props.name]
    );
    const [localSelect, setLocalSelect] = useState(
      selectText[props.name] === undefined ? ">=" : selectText[props.name]
    );
    return (
      <>
        <span className={"tableTitle"}>{props.caption}</span>
        <span className={"tableSubTitle"}>{props.subCaption}</span>
      </>
    );
  }

  function tableHeaderFn(caption: any) {
    var text;
    switch (caption) {
      case "Time":
        text = "(GMT+8)";
        break;
      case "10m Wind Dir":
        text = "Dir";
        break;
      case "10m Wind Speed":
        text = "Ws10m";
        break;
      case "10m Gust":
        text = "Wg10m";
        break;
      case "50m Wind Speed":
        text = "Ws50m";
        break;
      case "100m Wind Speed":
        text = "Ws100m";
        break;
      case "Wind Wave Height":
        text = "Hs";
        break;
      case "Wind Wave Direction":
        text = "Dir";
        break;
      case "Peak Wave Period":
        text = "Tp";
        break;
      case "Swell 1 Dir":
        text = "Dir";
        break;
      case "Swell 2 Dir":
        text = "Dir";
        break;
      case "Swell 1 Height":
        text = "Hs";
        break;
      case "Swell 2 Height":
        text = "Hs";
        break;
      case "Sig Wave Height":
        text = "Hs";
        break;
      case "Max Wave":
        text = "Hmax";
        break;
      case "Surface Current Dir Towards":
        text = "Dir";
        break;
      case "Surface Current Speed":
        text = "Sp";
        break;
      case "Visibility":
        text = "Vis";
        break;
      case "Wind Wave Period":
        text = "Tp";
        break;
      case "Swell 1 Period":
        text = "Tp";
        break;
      case "Swell 2 Period":
        text = "Tp";
        break;
      case "Accummulated Precip":
        text = "Amt";
        break;
      default:
        text = caption;
    }
    return text;
  }

  function HeaderFunction() {
    // Date
    let headers = new Array();
    let first = true;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "datetimeutc") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            {column.caption === "Time" ? "(GMT+8)" : column.name}
            {replace}
          </td>
        );
        first = false;
      }
    });
    //  Wind
    first = true;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "a_10mwinddir") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "a_10mwindspeed" ||
        column.name === "a_10mgust" ||
        column.name === "a_50mwindspeed" ||
        column.name === "a_80mwindspeed" ||
        column.name === "a_100mwindspeed"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionWw = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseadirection") {
        directionWw = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionWw === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableTitle
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }

    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseaheight" || column.name === "windseaperiod") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionS1 = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell1direction") {
        directionS1 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionS1 === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableTitle
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }

    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell1height" || column.name === "swell1period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionS2 = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2direction") {
        directionS2 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionS2 === false && swell2 !== 0) {
      //console.log("missing swell2 func")
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableTitle
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }

    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2height" || column.name === "swell2period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });


    //totalsea
    // eslint-disable-next-line no-lone-blocks
    first = true;
    let directionTS = false;
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (data === "surfacecurrentdirection") {
        directionTS = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    if (directionTS === false && total > 0) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            tableColorDatas["color_" + "surfacecurrentdirection" + "_" + 0]
          }
        >
          <TableTitle
            key={Math.random()}
            caption={"-"}
            subCaption={""}
            name={"-"}
            total_index={1}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (
        data === "sigwaveheight" ||
        data === "maxwave" ||
        (data !== "datetime" &&
          data !== "surfacecurrentdirection" &&
          data !== "a_10mwinddir" &&
          data !== "a_10mwindspeed" &&
          data !== "a_10mgust" &&
          data !== "a_50mwindspeed" &&
          data !== "a_80mwindspeed" &&
          data !== "a_100mwindspeed" &&
          data !== "windseadirection" &&
          data !== "windseaheight" &&
          data !== "swell1direction" &&
          data !== "swell1height" &&
          data !== "swell1period" &&
          data !== "swell2direction" &&
          data !== "swell2height" &&
          data !== "swell2period" &&
          data !== "rainrate" &&
          data !== "cloudbase" &&
          data !== "modelvisibility" &&
          data !== "windseaperiod" &&
          data !== "datetimeutc")
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "modelvisibility" ||
        column.name === "cloudbase" ||
        column.name === "rainrate"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        let first = true;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableTitle
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    return headers;
  }

  function HeaderUnit() {
    // Date
    let headers = new Array();
    let first = true;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "datetimeutc") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    //  Wind
    first = true;
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "a_10mwinddir" ||
        column.name === "a_10mwindspeed" ||
        column.name === "a_10mgust" ||
        column.name === "a_50mwindspeed" ||
        column.name === "a_80mwindspeed" ||
        column.name === "a_100mwindspeed"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    first = true;
    let directionWw = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseadirection") {
        directionWw = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionWw === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableUnit
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }

    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseaheight" || column.name === "windseaperiod") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    // Swell1
    first = true;
    let directionS1 = false;

    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseadirection") {
        directionS1 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionS1 === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableUnit
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell1height" || column.name === "swell1period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionS2 = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseadirection") {
        directionS2 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionS2 === false && swell2 !== 0) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={tableColorDatas["color_" + "windseadirection" + "_" + 0]}
        >
          <TableUnit
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2height" || column.name === "swell2period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    // eslint-disable-next-line no-lone-blocks
    first = true;
    let directionTS = false;
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (data === "surfacecurrentdirection") {
        directionTS = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    if (directionTS === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "#ADD8E6",
            color: "#192b3c",
            textAlign: "center",
            borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            tableColorDatas["color_" + "surfacecurrentdirection" + "_" + 0]
          }
        >
          <TableUnit
            key={Math.random()}
            caption={"Dir"}
            subCaption={""}
            name={"Dir"}
            total_index={1}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (
        data === "sigwaveheight" ||
        data === "maxwave" ||
        (data !== "datetime" &&
          data !== "surfacecurrentdirection" &&
          data !== "a_10mwinddir" &&
          data !== "a_10mwindspeed" &&
          data !== "a_10mgust" &&
          data !== "a_50mwindspeed" &&
          data !== "a_80mwindspeed" &&
          data !== "a_100mwindspeed" &&
          data !== "windseadirection" &&
          data !== "windseaheight" &&
          data !== "swell1direction" &&
          data !== "swell1height" &&
          data !== "swell1period" &&
          data !== "swell2direction" &&
          data !== "swell2height" &&
          data !== "swell2period" &&
          data !== "rainrate" &&
          data !== "cloudbase" &&
          data !== "modelvisibility" &&
          data !== "windseaperiod" &&
          data !== "datetimeutc")
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    first = true;
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "modelvisibility" ||
        column.name === "cloudbase" ||
        column.name === "rainrate"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        let first = true;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "#ADD8E6",
              color: "#192b3c",
              textAlign: "center",
              borderLeft: `${first === true ? "0.0px solid gray" : ""}`,
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableUnit
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    return headers;
  }

  function HeaderRange() {
    // Date
    let headers = new Array();
    let first = true;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "datetimeutc") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "selection" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    //  Wind
    first = true;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "a_10mwinddir") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "a_10mwinddir" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "a_10mwindspeed" ||
        column.name === "a_10mgust" ||
        column.name === "a_50mwindspeed" ||
        column.name === "a_80mwindspeed" ||
        column.name === "a_100mwindspeed"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "a_10mwinddir" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionWw = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseadirection") {
        directionWw = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    if (directionWw === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "white",
            color: "#192b3c",
            textAlign: "center",
            borderRight: `${""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            tableColorDatas["color_" + "windseadirection" + "_" + 0] ===
            undefined
              ? "-"
              : tableColorDatas["color_" + "windseadirection" + "_" + 0]
          }
        >
          <TableValue
            key={Math.random()}
            caption={tableHeaderFn("Dir")}
            subCaption={"Dir"}
            name={"windseadirection"}
            total_index={0}
          />
        </td>
      );
    }

    tableHeader.map((column: any, index: number) => {
      if (column.name === "windseaheight" || column.name === "windseaperiod") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionS1 = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell1direction") {
        directionS1 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    if (directionS1 === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "white",
            color: "#192b3c",
            textAlign: "center",
            borderRight: `${""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            tableColorDatas["color_" + "windseadirection" + "_" + 0] ===
            undefined
              ? "-"
              : tableColorDatas["color_" + "windseadirection" + "_" + 0]
          }
        >
          <TableValue
            key={Math.random()}
            caption={tableHeaderFn("Dir")}
            subCaption={"Dir"}
            name={"swell1direction"}
            total_index={0}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell1height" || column.name === "swell1period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionS2 = false;
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2direction") {
        directionS2 = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    if (directionS2 === false && swell2 !== 0) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "white",
            color: "#192b3c",
            textAlign: "center",
            borderRight: `${""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            tableColorDatas["color_" + "windseadirection" + "_" + 0] ===
            undefined
              ? "-"
              : tableColorDatas["color_" + "windseadirection" + "_" + 0]
          }
        >
          <TableValue
            key={Math.random()}
            caption={tableHeaderFn("Dir")}
            subCaption={"Dir"}
            name={"swell2direction"}
            total_index={0}
          />
        </td>
      );
    }
    tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2height" || column.name === "swell2period") {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });

    first = true;
    let directionTS = false;
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (data === "surfacecurrentdirection") {
        directionTS = true;
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    if (directionTS === false) {
      headers.push(
        <td
          key={Math.random()}
          style={{
            background: "white",
            color: "#192b3c",
            textAlign: "center",
            borderRight: `${""}`,
            width: "95%",
            display: "flex",
            justifyContent: "center",
          }}
          className={
            // eslint-disable-next-line no-useless-concat
            tableColorDatas["color_" + "surfacecurrentdirection" + "_" + 0] ===
            undefined
              ? "-"
              : // eslint-disable-next-line no-useless-concat
                tableColorDatas["color_" + "surfacecurrentdirection" + "_" + 0]
          }
        >
          <TableValue
            key={Math.random()}
            caption={tableHeaderFn("Dir")}
            subCaption={"Dir"}
            name={"surfacecurrentdirection"}
            total_index={0}
          />
        </td>
      );
    }
    // eslint-disable-next-line array-callback-return
    tableHeader.map((column: any, index: number) => {
      let data: any = column.name;
      if (
        data === "sigwaveheight" ||
        data === "maxwave" ||
        (data !== "datetime" &&
          data !== "surfacecurrentdirection" &&
          data !== "a_10mwinddir" &&
          data !== "a_10mwindspeed" &&
          data !== "a_10mgust" &&
          data !== "a_50mwindspeed" &&
          data !== "a_80mwindspeed" &&
          data !== "a_100mwindspeed" &&
          data !== "windseadirection" &&
          data !== "windseaheight" &&
          data !== "swell1direction" &&
          data !== "swell1height" &&
          data !== "swell1period" &&
          data !== "swell2direction" &&
          data !== "swell2height" &&
          data !== "swell2period" &&
          data !== "rainrate" &&
          data !== "cloudbase" &&
          data !== "modelvisibility" &&
          data !== "windseaperiod" &&
          data !== "datetimeutc")
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        first = false;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    first = true;
    // eslint-disable-next-line array-callback-return
    tableHeader.map((column: any, index: number) => {
      if (
        column.name === "modelvisibility" ||
        column.name === "cloudbase" ||
        column.name === "rainrate"
      ) {
        const replace =
          column.output_unit_name === "kts" || column.ud_unit_name === "kt"
            ? "kn"
            : column.ud_unit_name === "None"
            ? " - "
            : column.ud_unit_name;
        let first = true;
        headers.push(
          <td
            key={column.name}
            style={{
              background: "white",
              color: "#192b3c",
              textAlign: "center",
              width: "95%",
              display: "flex",
              justifyContent: "center",
            }}
            className={column.name === "datetimeutc" ? "date" : ""}
          >
            <TableValue
              key={Math.random()}
              caption={tableHeaderFn(column.caption)}
              subCaption={replace}
              name={column.name === "Time" ? "(GMT+8)" : column.name}
              total_index={index}
            />
          </td>
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        first = false;
      }
    });
    return headers;
  }

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container own-fug-container bg-default flex sidenav-full">
        <div className="content-wrap page-forecast">
          <div
            className="discussion-content"
            style={{
              marginBottom: "-20",
              marginTop: "-16px",
              padding: "20px",
            }}
          >
            <Table
              className="tabledis"
              style={{
                background: "white",
                borderRadius: "20px",
                boxShadow: "2px, 2px, 2px black",
                height: "10vh",
              }}
            >
              <TableRow>
                <td>
                  <strong>To:</strong> {""}
                  {localStorage.getItem("project")
                    ? localStorage.getItem("project")?.split("-")[0]
                    : " - "}
                </td>
              </TableRow>
              <TableRow>
                <td>
                  <strong>Subject:</strong> {""}
                  {subject.vessel_rig_platform_name && subject.field_area_name
                    ? `Weather Forecast for ${subject.vessel_rig_platform_name} valid for ${subject.field_area_name}`
                    : "NIL"}
                </td>
              </TableRow>
              <TableRow>
                <td>
                  <strong>Validity:</strong> {""}
                  {validity_a && validity_a.length > 0 && validity_b
                    ? `Forecast valid ${
                        validity_a[0].time_block
                      } hours from ${new Date(
                        validity_b.issue_date_time
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })} ${new Date(
                        validity_b.issue_date_time
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })} (UTC + 8)`
                    : "NIL"}
                </td>
              </TableRow>
              <TableRow>
<td>
<strong style={{ color: discussion.warning && discussion.warning.trim() !== "" ? "red" : "black" }}>
     Warning:
</strong>{" "}
   {discussion.warning && discussion.warning.trim() !== "" ? (
<span style={{ color: "red" }}>{discussion.warning}</span>
   ) : (
<span style={{ color: "black" }}>NIL</span>
   )}
</td>
</TableRow>
              <TableRow>
                <td>
                  <strong>Met Situation:</strong>{" "}
                  {discussion.synopsis ? discussion.synopsis : " NIL "}
                </td>
              </TableRow>
              <TableRow>
                <td>
                  <strong>Tropical Advisory:</strong>{" "}
                  {discussion.advisory ? discussion.advisory : "NIL"}
                </td>
              </TableRow>

              <TableRow>
                {" "}
                <td style={{ width: "50%" }}>
                  <strong>Weather:</strong>{" "}
                  {discussion.notes !== undefined || discussion.notes
                    ? discussion.notes
                    : "NIL"}
                </td>{" "}
              </TableRow>
            </Table>
          </div>
          <Main
            open={open}
            className={"main"}
            style={{
              overflow: "auto",
              marginTop: "-32px",
              height,
            }}
          >
            {loading ? (
              <div className={"loader-div"}>
                <WeatherLoader />
              </div>
            ) : (
              <div className={"container-section"}>
                <div className={"forecast-div"}>
                  <h6 className={"forcast-header"}>Time-Step</h6>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      labelId="model-data"
                      id="model-data"
                      className="menuitem"
                      value={dataTable}
                      onChange={handleChange}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                    >
                      <MenuItem className="menuitem" value={0}>
                        All
                      </MenuItem>
                      {[3, 6, 12, 24]
                        .slice([3, 6, 12, 24].indexOf(interval))
                        .map((s) => (
                          <MenuItem
                            className="menuitem"
                            key={Math.random()}
                            value={s}
                          >
                            {s} hourly Data
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{ m: 1, minWidth: 180, minHeight: 10 }}
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
                      className="menuitem"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                        fontSize: 15,
                      }}
                    >
                      {criteriaDatas.length === 0 ? (
                        <MenuItem
                          className="menuitem"
                          value="No datas Available"
                        >
                          No datas Available
                        </MenuItem>
                      ) : (
                        criteriaDatas.map((data: any) => (
                          <MenuItem
                            className="menuitem"
                            key={data.forecast_osf_criteria_id}
                            value={data.forecast_osf_criteria_id}
                          >
                            {data.criteria_name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleDownloadCsv}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "4vh",
                        position: "absolute",
                        right: "100px",
                        top: "10px",
                      }}
                      startIcon={<InsertDriveFileIcon />}
                      disabled={loadingCsv}
                    >
                      {loadingCsv ? (
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "CSV"
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDownload}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                        height: "4vh",
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                      }}
                      startIcon={<PictureAsPdfIcon />}
                      disabled={loadingPdf}
                    >
                      {loadingPdf ? (
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "PDF"
                      )}
                    </Button>
                    <div
                      style={{
                        position: "absolute",
                        right: "5vw",
                        top: "5vh",
                        color: "black",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        zIndex: 1,
                      }}
                    >
                      Download
                    </div>
                  </div>
                </div>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "auto",
                    overflowX: "hidden",
                    "@media (max-width: 960px)": {
                      width: "300%",
                    },
                  }}
                >
                  <table>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        border: "0.5px solid #437c92",
                        backgroundColor: "#add8e6",
                      }}
                    >
                      <tr style={{ border: "0.5px solid #437c92" }}>
                        {HeaderRange().map((d: any) => (
                          <th className="theadtitleWhite">{d}</th>
                        ))}
                      </tr>
                      <tr className="colorRow">
                        <th className="theadtitle">
                          <p>
                            <strong>LocalTime</strong>
                          </p>
                        </th>
                        <th className="theadtitle" colSpan={wind}>
                          <p>Winds</p>
                        </th>
                        <th
                          className="theadtitle"
                          colSpan={
                            isDirWw === true ? windwave + 1 : windwave + 1
                          }
                        >
                          <p>Wind Waves</p>
                        </th>
                        <th
                          className="theadtitle"
                          colSpan={presentS1 === true ? swell1 + 1 : swell1}
                        >
                          <p>Swell 1</p>
                        </th>
                        {swell2 !== 0 ? (
                          <th
                            className="threadtitle"
                            colSpan={presentS2 === true ? swell2 + 1 : swell2}
                          >
                            <p style={{ fontWeight: "normal" }}>Swell2</p>
                          </th>
                        ) : null}

                        {total > 0 ? (
                          <th
                            className="theadtitle"
                            colSpan={isDirTS === true ? total + 1 : total}
                          >
                            <p>Total Sea</p>
                          </th>
                        ) : (
                          <></>
                        )}

                        {weather !== 0 && (
                          <th className="theadtitle" colSpan={weather}>
                            <p>Weather</p>
                          </th>
                        )}
                      </tr>
                      <tr className="colorRow">
                        {HeaderFunction().map((d: any) => (
                          <th className="theadtitle">{d}</th>
                        ))}
                      </tr>
                      <tr>
                        {HeaderUnit().map((d: any) => (
                          <th className="theadunitWhite">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{tableContent}</tbody>
                  </table>
                </Paper>
              </div>
            )}
          </Main>
        </div>
      </Box>
    </div>
  );
};
export default ForeCast;
