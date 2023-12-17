import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import WeatherLoader from "../../components/loader";
import store from "../../store";
import "./styles/_index.scss";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

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
function calculateWindDir(data: number) {
  let calc: Array<Array<any>> = [];
  let calcData: any = {
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    EFE: 112.5,
    FE: 135,
    FFE: 157.5,
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [buttonHidden, setButtonHidden] = useState<object | any>({});
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
  const [timestraping,setTimeStraping] = useState([])
  const [fetchCount, setFetchCount] = useState(0)
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [totalDBdata, setTotalDBdata] = useState(0);
  const [headerTiming, setHeaderTiming ] = useState(0);

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
    fetch("http://127.0.0.1:8000/api/overview/", {
      method: "POST",
      body: JSON.stringify({ forecast_id: localStorage.getItem("fid") }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Basic " + btoa("admin:admin"),
      },
      cache: "no-cache",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCriteriaDatas(data.criteria_datas);
        setCriteriaDetailDatas(data.criteria_detail_datas);
        setSelectValue(
          String(data.criteria_detail_datas[0].forecast_osf_criteria_id)
        );
        //setLoading(false);
      })
      .catch((error) => {
        //setLoading(false);
        console.log("Cannot Fetch Table Datas");
      });
  }, []);

  // Forecast
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/forecast/", {
      method: "POST",
      body: JSON.stringify({ forecast_id: localStorage.getItem("fid"), length: 0 }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTableHeaders(data.headers);
        setForecastDatas(data.datas);
        setTableDatas(data.datas);
        setInterval(data.interval);
        setDiscussion(data.discussion.discussion);
        setDisDetail(data.discussion.discussion_detail);
        setTotalDBdata((data.total).length - 8)
      })
      .catch((error) => console.log("Cannot Fetch Table Datass", error));
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
    console.log(TableDatas)
    for(const key of timestraping) {
      analysetheData(key, inputText[key], selectText[key])
    }
  },[timestraping, TableDatas])

  useEffect(() => {
    setTotalDataCount(GetTotalDatasCount())
    for (const data of tableHeader) {
      switch (data.name) {
        case "a_10mwinddir":
          setWind((prev) => prev + 1);
          break;
        case "a_10mwindspeed":
          setWind((prev) => prev + 1);
          break;
        case "a_10mgust":
          setWind((prev) => prev + 1);
          break;
        case "a_50mwindspeed":
          setWind((prev) => prev + 1);
          break;
        case "a_80mwindspeed":
          setWind((prev) => prev + 1);
          break;
        case "a_100mwindspeed":
          setWind((prev) => prev + 1);
          break;
        case "windseaheight":
          setWindWave((prev) => prev + 1);
          break;
        case "windseaperiod":
          setWindWave((prev) => prev + 1);
          break;
        case "swell1height":
          setSwell1((prev) => prev + 1);
          break;
        case "swell1period":
          setSwell1((prev) => prev + 1);
          break;
        case "swell1direction":
          setSwell1((prev) => prev + 1);
          break;
        case "swell2direction":
          setSwell2((prev) => prev + 1);
          break;
        case "swell2height":
          setSwell2((prev) => prev + 1);
          break;
        case "swell2period":
          setSwell2((prev) => prev + 1);
          break;
        case "sigwaveheight":
          setTotal((prev) => prev + 1);
          break;
        case "maxwave":
          setTotal((prev) => prev + 1);
          break;
        case "rainrate":
          setWeather((prev) => prev + 1);
          break;
        case "cloudbase":
          setWeather((prev) => prev + 1);
          break;
        case "modelvisibility":
          setWeather((prev) => prev + 1);
          break;
        case "datetime":
          break;
        default:
          setTotal((prev) => prev + 1);
      }
    }
    console.log(headerTiming)
    if(headerTiming === 3) {
      setLoading(false)
    }
    setHeaderTiming((prev)=>prev + 1)
  }, [tableHeader]);


  function analysetheData(arg: string, text: string, mode: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    let table: any = { ...tableColorDatas };
    for (const data in table) {
      if (data.slice(6).split("").slice(0, -1).join("") === arg) {
        delete table[data];
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setTableColorDatas((prev:any) => {table});
    let total_index= 0;
    TableDatas.forEach((datas: any) => {
      for (const eachinner in datas) {
        let boolean_value = false;
        let color = null;
        if (mode === ">=") {
          color = "green";
          console.log(datas[eachinner][arg] >= parseFloat(text), datas[eachinner][arg])
          boolean_value = Math.floor(datas[eachinner][arg]) >= parseFloat(text);
        } else if (mode === "<=") {
          color = "blue";
          console.log(datas[eachinner][arg] <= parseFloat(text), datas[eachinner][arg])
          boolean_value = Math.floor(datas[eachinner][arg]) <= parseFloat(text);
        }
        if (boolean_value) {
          table["color_" + arg + "_" + total_index] = color;
        }
        else {
          table["color_"+arg+"_"+total_index] = "white";
        }
        total_index += 1;
      }
    });
    setTableColorDatas(table);
  }
  function Dateformat(celldata: any) {
    // const [datePart, timePart] = celldata.split(" ");
    // const [day, month, year] = datePart.split("/").map(Number);
    // const [hour, minute] = timePart.split(":").map(Number);
    const dateObject = new Date(celldata);
    const inputDate = dateObject;
    const dayc = dayNames[inputDate.getDay()];
    const monthc = monthNames[inputDate.getMonth()];
    const yearc = inputDate.getFullYear();
    // if (day === undefined) {
    //   return celldata;
    // }
    return `${dayc}, ${inputDate.getDate()} ${monthc} ${yearc}`;
  }

  useEffect(() => {
    // Initialize a new array for colors
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
    setOverViewColor(newColorArray);
    //console.log("table color==============>", overViewColor);
  }, [SelectValue]);

  let incr = 0;
  function ScrapeDatas(datas: any, index: number) {
    let total_index = index;
    var dict: any = [];
    var dates: any = [];
    for (const data_array in datas) {
      var dict_temp: any = [];
      // Date
      let first = true;
      let dayformat = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (
          data === "datetimeutc"
        ) {
          var weatherDate = new Date(cellData);
          dates.push(weatherDate);
          // eslint-disable-next-line no-lone-blocks
          {
            typeof weatherDate === "object" &&
            typeof cellData === "string" &&
            cellData.length === 16 &&
            !dates.indexOf(weatherDate) ? (
              <>
                {dict.push(
                  <TableRow>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        borderTop: "1px solid black",
                        maxHeight: "4px",
                        borderBottom: "1px solid black",
                        borderRight: "0.5px solid gray",
                      }}
                      key={Math.random()}
                      colSpan={16}
                    >
                      {cellData === null || cellData === undefined
                        ? "-"
                        : Dateformat(cellData)}
                        {dayformat = false}
                    </TableCell>
                  </TableRow>
                )}
                {dict_temp.push(
                  <TableCell
                    style={{
                      borderRight: "0.5px solid gray",
                      textAlign: "center",
                    }}
                    className={
                      `${
                            tableColorDatas[
                              "color_" + data + "_" + total_index
                            ] === undefined
                              ? ""
                              : tableColorDatas[
                                  "color_" + data + "_" + total_index
                                ]
                          }`
                    }
                    key={Math.random()}
                  >
                    {cellData === null || cellData === undefined ? (
                      "-"
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "3px",
                          }}
                          className={overViewColor[incr]}
                        ></div>
                        {cellData.slice(10)}
                      </div>
                    )}
                  </TableCell>
                )}
              </>
            ) : (
              dict_temp.push(
                <TableCell
                  style={{
                    borderRight: "0.5px solid gray",
                    textAlign: "center",
                  }}
                  className={
                    `${
                          tableColorDatas[
                            "color_" + data + "_" + total_index
                          ] === undefined
                            ? ""
                            : tableColorDatas[
                                "color_" + data + "_" + total_index
                              ]
                        }`
                  }
                  key={Math.random()}
                >
                  {cellData === null || cellData === undefined ? (
                    "-"
                  ) : typeof cellData === "string" && cellData.length === 16 ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "3px",
                        }}
                        className={overViewColor[incr]}
                      ></div>
                      {cellData.slice(10)}
                    </div>
                  ) : cellData
                  }
                </TableCell>
              )
            );
          }
        }
      }

      // Wind
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "a_10mwinddir") {
          cellData = calculateWindDir(datas[data_array][data]);
        }
        if (
          data === "modelvisibility" ||
          data === "cloudbase" ||
          data === "rainrate"
        ) {
          continue;
        }
        if (
          data === "a_10mwinddir" ||
          data === "a_10mwindspeed" ||
          data === "a_10mgust" ||
          data === "a_50mwindspeed" ||
          data === "a_80mwindspeed" ||
          data === "a_100mwindspeed"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            (
              dict_temp.push(
                <TableCell
                  style={{
                    borderRight: `${
                      ""
                    }`,
                    textAlign: "center",
                  }}
                  className={
                    `${
                          tableColorDatas[
                            "color_" + data + "_" + total_index
                          ] === undefined
                            ? ""
                            : tableColorDatas[
                                "color_" + data + "_" + total_index
                              ]
                        }`
                  }
                  key={Math.random()}
                >
                  {cellData === null || cellData === undefined ? (
                    "-"
                  ) : typeof cellData === "string" && cellData.length === 16 ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "3px",
                        }}
                        className={overViewColor[incr]}
                      ></div>
                      {cellData.slice(10)}
                    </div>
                  ) : data === "a_10mwindspeed" ||
                    data === "a_10mgust" ||
                    data === "a_50mwindspeed" ||
                    data === "a_80mwindspeed" ||
                    data === "a_100mwindspeed" ? (
                    Math.floor(cellData)
                  ) : (
                    cellData
                  )}
                </TableCell>
              )
            );
          }
        }
      }
      // Windwaves
      first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (
          data === "windseadirection" ||
          data === "windseaheight" ||
          data === "windseaperiod"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <TableCell
                style={{
                  borderLeft: `${first === true ? "0.5px solid gray" : ""}`,
                  textAlign: "center",
                }}
                className={`${
                  tableColorDatas["color_" + data + "_" + total_index] ===
                  undefined
                    ? ""
                    : tableColorDatas["color_" + data + "_" + total_index]
                }`}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    ></div>
                    {cellData.slice(10)}
                  </div>
                ) : (
                  cellData
                )}
                {(first = !first)}
              </TableCell>
            );
          }
        }
      }
      // Swell 1
      first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (
          data === "swell1direction" ||
          data === "swell1height" ||
          data === "swell1period"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <TableCell
                style={{
                  borderLeft: `${
                    first === true && data !== "swell1period"
                      ? "0.5px solid gray"
                      : ""
                  }`,
                  textAlign: "center",
                }}
                className={`${
                  tableColorDatas["color_" + data + "_" + total_index] ===
                  undefined
                    ? ""
                    : tableColorDatas["color_" + data + "_" + total_index]
                }`}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    ></div>
                    {cellData.slice(10)}
                  </div>
                ) : (
                  Math.floor(cellData)
                )}
                {(first = !first)}
              </TableCell>
            );
          }
        }
      }
      // Swell 2
      first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (
          data === "swell2direction" ||
          data === "swell2height" ||
          data === "swell2period"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <TableCell
                style={{
                  borderLeft: `${
                    first === true && data !== "swell2period"
                      ? "0.5px solid gray"
                      : ""
                  }`,
                  textAlign: "center",
                }}
                className={`${
                  tableColorDatas["color_" + data + "_" + total_index] ===
                  undefined
                    ? ""
                    : tableColorDatas["color_" + data + "_" + total_index]
                }`}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    ></div>
                    {cellData.slice(10)}
                  </div>
                ) : (
                  Math.floor(cellData)
                )}
                {(first = !first)}
              </TableCell>
            );
          }
        }
      }
      // Total Sea
      first = true;
      for (let data in datas[data_array]) {
        let cellData = datas[data_array][data];
        // eslint-disable-next-line no-mixed-operators
        if (
          data === "sigwaveheight" ||
          data === "maxwave" ||
          (data !== "datetime" &&
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
            data !== "windseaperiod") &&
            data !== "datetimeutc"
        ) {
          // eslint-disable-next-line no-lone-blocks
          {
            dict_temp.push(
              <TableCell
                style={{
                  borderLeft: `${
                    first === true && data === "sigwaveheight"
                      ? "0.5px solid gray"
                      : ""
                  }`,
                  textAlign: "center",
                }}
                className={`${
                  tableColorDatas["color_" + data + "_" + total_index] ===
                  undefined
                    ? ""
                    : tableColorDatas["color_" + data + "_" + total_index]
                }`}
                key={Math.random()}
              >
                {cellData === null || cellData === undefined ? (
                  "-"
                ) : typeof cellData === "string" && cellData.length === 16 ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                      className={overViewColor[incr]}
                    ></div>
                    {cellData.slice(10)}
                  </div>
                ) : (
                  cellData
                )}
                {(first = !first)}
              </TableCell>
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
            <TableCell
              style={{
                borderLeft: `${first === true ? "0.5px solid gray" : ""}`,
                textAlign: "center",
              }}
              className={`${
                tableColorDatas["color_" + data + "_" + total_index] ===
                undefined
                  ? ""
                  : tableColorDatas["color_" + data + "_" + total_index]
              }`}
              key={Math.random()}
            >
              {cellData === null || cellData === undefined ? (
                "-"
              ) : typeof cellData === "string" && cellData.length === 16 ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "3px",
                    }}
                    className={overViewColor[incr]}
                  ></div>
                  {cellData.slice(10)}
                </div>
              ) : (
                Math.floor(cellData)
              )}
              {(first = !first)}
            </TableCell>
          );
        }
      }
      dict.push(
        <TableRow
          style={{ background: `${incr % 2 === 0 ? "#eaeaeb" : "#FFFFFFF"}` }}
          key={Math.random()}
        >
          {dict_temp.map((s: any) => s)}
        </TableRow>
      );
      total_index += 1;
      incr += 1;
    }
    return dict;
  }

  
  function ScrapeDatas2() {
    let total_index = 0;
    let dict: any = [];
    TableDatas.forEach((data: any) => {
      ScrapeDatas(data, total_index).forEach((d: any) => {
        dict.push(d);
        total_index += 1;
      });
      total_index -= 1;
    });
    return dict.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }
  function GetTotalDatasCount() {
    let total_index = 0;
    TableDatas.forEach((data: any) => {
      total_index += data.length;
    });
    return total_index;
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
    for(const key in tableColorDatas) {
      let name = key.slice(6,key.lastIndexOf("_"))
      nameArray.push(name)
    }
    
    const name:any = Array.from(new Set(nameArray));
    setTableDatas(dict);
    setTimeStraping(name);
    setPage(0);
  };


  const fetchData = async (newPage: number) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/forecast/', {
        method: 'POST',
        body: JSON.stringify({ forecast_id: localStorage.getItem('fid'), length: fetchCount+1 }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        cache: 'no-cache',
      });

      const data = await response.json();
      console.log(data.datas)
      var recvData : any = (Object.values(data.datas))
      var newData : any = (Object.values(data.datas))[0];
      var firstData : any = newData[0];
      const firstDate = new Date(firstData.datetimeutc);
      var firstprevData = new Date(TableDatas[0][0].datetimeutc)
      var prevData = new Date(TableDatas[TableDatas.length-1][0].datetimeutc);
      if(firstDate.getDate() === prevData.getDate()) {
        var appendData = TableDatas
        appendData[appendData.length -1] = appendData[appendData.length-1].concat(newData)
        recvData.forEach((element:any,index:number) => {
          if(index!==0) {
            appendData.push(element)
          }
        });
        let total_index = 0;
        appendData.forEach((data: any) => {
          total_index += data.length;
        });
        setTotalDataCount(total_index)
        setTableDatas(appendData)
      }
      else if(firstDate.getDate() === firstprevData.getDate()){
        var total_value = totalDBdata - totalDataCount
        console.log(total_value,total, totalDataCount)
        setTotalDataCount((prevData) => prevData + total_value )
      }
      else {
        setTableDatas((prev: any) => [...prev, ...Object.values(data.datas)]);
      }
    } catch (error) {
      console.error('Cannot Fetch Table Data', error);
    }
  };

  useEffect(() => {
    setTotalDataCount(GetTotalDatasCount())
  },[TableDatas])


  const handlePageChange = (event: any, newPage: number) => {
    // If the next page is within the total data count and greater than 0, update the page
    console.log("Hey", newPage, rowsPerPage, totalDataCount, totalDBdata)
    if (newPage > 0 && newPage * rowsPerPage >= 10 && totalDataCount < totalDBdata) {
      setFetchCount((prev) => prev+1)
      fetchData(newPage);
      setPage(newPage);
    }
    else {
      setPage(newPage)
    }
    
  };

  const handleRowsPerPageChange = (event: any) => {
    console.log("Second")
    const newRowsPerPage = +event.target.value;
    console.log(newRowsPerPage)
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when changing rowsPerPage
    fetchData(0);
  };


  function TableTitle(props: any) {
    const [localInputText, setLocalInputText] = useState(
      inputText[props.name] === undefined ? "" : inputText[props.name]
    );
    const [localSelect, setLocalSelect] = useState(
      selectText[props.name] === undefined ? ">=" : selectText[props.name]
    );
    return (
      <div className={"tableTitlediv"}>
        <div className={"tableTitleDivinner"}>
          <span className={"tableTitle"}>{props.caption}</span>
          <span className={"tableSubTitle"}>{props.subCaption}</span>
        </div>
        {props.name !== "datetimeutc" ? (
          <>
            <div
              className={"tableButtons"}
              style={{
                opacity: props.caption === "10m Wind Dir" ? 0 : 1,
              }}
            >
              <button
                disabled={props.caption === "10m Wind Dir"}
                onClick={(event) => {
                  let buttons = { ...buttonHidden };
                  buttons[props.name] = true;
                  setButtonHidden(buttons);
                }}
                style={{
                  display: !buttonHidden[props.name] ? "contents" : "none",
                }}
              >
                {props.name !== "a_10mwinddir" ? (
                  <AddIcon
                    style={{ color: "black", cursor: "pointer" }}
                    fontSize="small"
                  />
                ) : (
                  <></>
                )}
              </button>
              <select
                value={localSelect}
                style={{ display: buttonHidden[props.name] ? "" : "none" }}
                onChange={(text) => setLocalSelect(text.target.value)}
              >
                <option value=">=">{">="}</option>
                <option value="<=">{"<="}</option>
              </select>
              <input
                style={{ display: buttonHidden[props.name] ? "" : "none" }}
                value={localInputText}
                type="number"
                onChange={(text) => {
                  setLocalInputText(text.target.value);
                }}
              ></input>
              <button
                style={{ display: buttonHidden[props.name] ? "" : "none" }}
                onClick={(event) => {
                  let select = { ...selectText };
                  select[props.name] = localSelect;
                  setSelectText(select);
                  let inputtext = { ...inputText };
                  inputtext[props.name] = localInputText;
                  setInputText(inputtext);
                  analysetheData(props.name, localInputText, localSelect);
                }}
              >
                <DoneIcon style={{ color: "black" }} fontSize="small" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={"tableButtons"}
              style={{
                opacity: props.caption === "10m Wind Dir" ? 0 : 1,
              }}
            >
              <button
                disabled={props.caption === "10m Wind Dir"}
                onClick={() => {
                  setTableColorDatas({});
                  setButtonHidden({});
                }}
                style={{
                  display: !buttonHidden[props.name] ? "contents" : "none",
                }}
              >
                <CloseIcon
                  style={{ color: "black", cursor: "pointer" }}
                  fontSize="small"
                />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  function swell2fn() {
    return tableHeader.map((column: any, index: number) => {
      if (column.name === "swell2direction") {
        return (
          <>
            <TableCell
              style={{
                maxWidth: 8,
                background: "#eaeaeb",
                color: "#192b3c",
                borderTop: "0.5px solid gray",
                borderBottom: "0.5px solid gray",
                textAlign: "center",
                fontWeight: "bolder",
              }}
              colSpan={swell2 / 2}
            >
              Swell 2
            </TableCell>
          </>
        );
      }
    });
  }
  function tableHeaderFn(caption: any) {
    var text;
    switch (caption) {
      case "Time":
        text = "(GST+8)";
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
        text = "Hsig";
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
  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap page-forecast">
          <div
            className="discussion-content"
            style={{
              marginBottom: "-30",
              marginTop: "-16px",
              padding: "20px",
            }}
          >
            <Table
              style={{
                background: "white",
                borderRadius: "20px",
                boxShadow: "2px, 2px, 2px black",
              }}
            >
              <TableRow>
                {" "}
                <TableCell>
                  <strong>Synopsis Summary:</strong>{" "}
                  {discussion.synopsis !== undefined
                    ? discussion.synopsis
                    : "-"}
                </TableCell>{" "}
              </TableRow>{" "}
              <TableRow>
                {" "}
                <TableCell>
                  <b>Tropical Adivosy:</b>{" "}
                  {discussion.advisory !== undefined
                    ? discussion.advisory
                    : "-"}
                </TableCell>{" "}
              </TableRow>{" "}
              <TableRow>
                {" "}
                <TableCell>
                  Warning:{" "}
                  {discussion.warning !== undefined ? discussion.warning : "-"}
                </TableCell>{" "}
              </TableRow>{" "}
              <TableRow>
                {" "}
                <TableCell style={{width:"50%"}}>
                  Notes:{" "}
                  {discussion.notes !== undefined ? discussion.notes : "-"}
                </TableCell>{" "}
                <TableCell>
                  {" "}
                  <TableRow
                    style={{
                      marginTop: "0px",
                      padding: "0px",
                    }}
                  >
                    {" "}
                    <TableCell>
                      {" "}
                      {disDetail && disDetail.other_text_title !== undefined
                        ? disDetail.other_text_title
                        : "Discussion Title"}
                      {"-"}
                    </TableCell>{" "}
                    <TableCell>
                      {" "}
                      {disDetail &&
                      disDetail.other_text_description !== undefined
                        ? disDetail.other_text_description
                        : "-"}{" "}
                    </TableCell>{" "}
                  </TableRow>{" "}
                  <TableRow>
                    {" "}
                    <TableCell>
                      Visibility: {min} - {max} km{" "}
                    </TableCell>{" "}
                  </TableRow>{" "}
                </TableCell>{" "}
              </TableRow>
            </Table>
          </div>
          <Main open={open} className={"main"} style={{ overflow: "auto", marginTop: "-32px" }}>
            {loading ? (
              <div className={"loader-div"}>
                <WeatherLoader />
              </div>
            ) : (
              <div className={"container-section"}>
                <div className={"forecast-div"}>
                  <h4 className={"forcast-header"}>Timestamp</h4>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      labelId="model-data"
                      id="model-data"
                      value={dataTable}
                      onChange={handleChange}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        textAlign: "center",
                      }}
                    >
                      <MenuItem value={0}>All</MenuItem>
                      {[3, 6, 12, 24]
                        .slice([3, 6, 12, 24].indexOf(interval))
                        .map((s) => (
                          <MenuItem key={Math.random()} value={s}>
                            {s} hours Data
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
                      style={{
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
                  {/* <div>
                    <CloseIcon
                      style={{
                        color: "black",
                        cursor: "default",
                        marginLeft: "20vh",
                        alignItems: "end",
                        paddingRight: "auto",
                        border: "1px solid black",
                        borderRadius: "10px",
                      }}
                      onClick={() => setTableColorDatas({})}
                      fontSize="large"
                    />
                  </div> */}
                  {/* </Stack> */}
                </div>
                <Paper sx={{ width: "100%", overflow: "hidden"}}>
                  <TableContainer
                    sx={{ maxHeight: "90%" }}
                    style={{ width: "100%" }}
                  >
                    <Table stickyHeader>
                      <TableHead style={{ maxWidth: "150px" }}>
                        <TableRow
                          style={{
                            position: "sticky",
                            top: 0,
                            background: "#eaeaeb",
                          }}
                        >
                          <TableCell
                            style={{
                              maxWidth: 8,
                              background: "#eaeaeb",
                              color: "#192b3c",
                              borderLeft: "0.5px solid gray",
                              borderTop: "0.5px solid gray",
                              borderBottom: "0.5px solid gray",
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                          >
                            LocalTime
                          </TableCell>
                          <TableCell
                            style={{
                              maxWidth: 8,
                              background: "#eaeaeb",
                              color: "#192b3c",
                              borderLeft: "0.5px solid gray",
                              borderTop: "0.5px solid gray",
                              borderBottom: "0.5px solid gray",
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                            colSpan={wind / 2}
                          >
                            Winds
                          </TableCell>
                          <TableCell
                            style={{
                              maxWidth: 8,
                              background: "#eaeaeb",
                              color: "#192b3c",
                              borderLeft: "0.5px solid gray",
                              borderTop: "0.5px solid gray",
                              borderBottom: "0.5px solid gray",
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                            colSpan={windwave / 2}
                          >
                            Wind Waves
                          </TableCell>
                          <TableCell
                            style={{
                              background: "#eaeaeb",
                              color: "#192b3c",
                              borderTop: "0.5px solid gray",
                              borderBottom: "0.5px solid gray",
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                            colSpan={swell1 / 2}
                          >
                            Swell 1
                          </TableCell>
                          {swell2fn()}
                          <TableCell
                            style={{
                              minWidth: 115,
                              background: "#eaeaeb",
                              color: "#192b3c",
                              borderTop: "0.5px solid gray",
                              borderBottom: "0.5px solid gray",
                              textAlign: "center",
                              fontWeight: "bolder",
                            }}
                            colSpan={(total/ 2)-1}
                          >
                            Total Sea
                          </TableCell>
                          {weather !== 0 ? (
                            <TableCell
                              style={{
                                minWidth: 115,
                                background: "#eaeaeb",
                                color: "#192b3c",
                                borderTop: "0.5px solid gray",
                                borderBottom: "0.5px solid gray",
                                borderLeft: "1px solid gray",
                                textAlign: "center",
                                fontWeight: "bolder",
                              }}
                              colSpan={weather / 2}
                            >
                              Weather
                            </TableCell>
                          ) : null}
                        </TableRow>
                        <TableRow>
                          {tableHeader.map((column: any, index: number) => {
                            if (
                              column.name === "modelvisibility" ||
                              column.name === "cloudbase" ||
                              column.name === "rainrate"
                            ) {
                              console.log("");
                            } else {
                              const replace =
                                column.output_unit_name === "kts" ||
                                column.ud_unit_name === "kt"
                                  ? "kn"
                                  : column.ud_unit_name === "None"
                                  ? " - "
                                  : column.ud_unit_name;
                              return (
                                <TableCell
                                  key={column.name}
                                  style={{
                                    background: "#eaeaeb",
                                    color: "#192b3c",
                                    textAlign: "center",
                                    borderRight: `${
                                      column.name === "datetimeutc"
                                        ? "1px solid gray"
                                        : ""
                                    }`,
                                    borderLeft: `${
                                      column.caption === "Wind Wave Height" ||
                                      column.name === "swell2direction" ||
                                      column.name === "swell1direction" ||
                                      column.name === "sigwaveheight"
                                        ? "1px solid gray"
                                        : ""
                                    }`,
                                  }}
                                  className={
                                    column.name === "datetimeutc"
                                      ? "date"
                                      : tableColorDatas[
                                          "color_" + column.name + "_" + index
                                        ] === undefined
                                      ? ""
                                      : tableColorDatas[
                                          "color_" + column.name + "_" + index
                                        ]
                                  }
                                >
                                  <TableTitle
                                    key={Math.random()}
                                    caption={tableHeaderFn(column.caption)}
                                    subCaption={replace}
                                    name={
                                      column.name === "Time"
                                        ? "(GST+8)"
                                        : column.name
                                    }
                                    total_index={index}
                                  />
                                </TableCell>
                              );
                            }
                          })}
                          {tableHeader.map((column: any, index: number) => {
                            if (
                              column.name === "modelvisibility" ||
                              column.name === "cloudbase" ||
                              column.name === "rainrate"
                            ) {
                              const replace =
                                column.output_unit_name === "kts" ||
                                column.ud_unit_name === "kt"
                                  ? "kn"
                                  : column.ud_unit_name === "None"
                                  ? " - "
                                  : column.ud_unit_name;
                              let first = true;
                              return (
                                <TableCell
                                  key={column.name}
                                  style={{
                                    maxWidth: 8,
                                    background: "#eaeaeb",
                                    color: "#192b3c",
                                    borderLeft: `${
                                      first === true ? "1px solid gray" : ""
                                    }`,
                                    textAlign: "center",
                                  }}
                                  className={
                                    column.name === "datetimeutc"
                                      ? "date"
                                      : tableColorDatas[
                                          "color_" + column.name + "_" + index
                                        ] === undefined
                                      ? ""
                                      : tableColorDatas[
                                          "color_" + column.name + "_" + index
                                        ]
                                  }
                                >
                                  <TableTitle
                                    key={Math.random()}
                                    caption={column.caption}
                                    subCaption={replace}
                                    name={
                                      column.name === "Time" ? (
                                        <>
                                          (GST+8)
                                          <div>
                                            <CloseIcon
                                              style={{
                                                color: "black",
                                                cursor: "default",
                                                marginLeft: "20vh",
                                                alignItems: "end",
                                                paddingRight: "auto",
                                                border: "1px solid black",
                                                borderRadius: "10px",
                                                borderRight:"0.5px solid gray"
                                              }}
                                              onClick={() =>
                                                setTableColorDatas({})
                                              }
                                              fontSize="large"
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        column.name
                                      )
                                    }
                                    total_index={index}
                                  />
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>{ScrapeDatas2().map((d: any) => d)}</TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={totalDataCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
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