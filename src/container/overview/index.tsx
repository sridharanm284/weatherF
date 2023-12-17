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
import CustomSpinner from "../../components/loader";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import WeatherLoader from "../../components/loader";

// space between Navigation and Table Content
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

export default function Overview() {
  // Reference value for current Browser Window Width
  const windowWidth = useRef(window.innerWidth);

  // Sets Track about the SideNav Bar Open/Close State
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);

  const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
  const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([]);
  const [TableDatas, setTableDatas] = useState<any>([]);
  const [SelectValue, setSelectValue] = useState<any>("");
  const [loading, setLoading] = useState(true);

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
        setTableDatas(data.datas);
        setSelectValue(
          String(data.criteria_detail_datas[0].forecast_osf_criteria_id)
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Cannot Fetch Table Datas");
      });
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
    var dayarray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var day = dayarray[date.getDay()];
    var d = date.getDate();
    var m = montharray[date.getMonth()];
    return day + " " + (date.getHours() === 0 ? d - 1 : d) + " " + m;
  }

  function getColor(data: number) {
    var criteria: any = {};
    console.log(SelectValue, "selectedValue");
    criteriaDetailDatas.forEach((c_data: any) => {
      if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
        criteria = c_data;
      }
    });
    if (
      (data >= criteria.value && data <= criteria.margin_value) ||
      (data <= criteria.value && data >= criteria.margin_value)
    ) {
      return "yellow_overview";
    } else if (data > criteria.value && data > criteria.margin_value) {
      return "red_overview";
    } else if (data < criteria.value && data < criteria.margin_value) {
      return "green_overview";
    }
  }

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
    return calc[0][calc[0].length - 1];
  }

  function ScrapeGraphDatas() {
    let data_list: Array<object> = [];
    TableDatas.forEach((datas: any) => {
      datas.forEach((data: any) => {
        data["date"] = dateFormat(new Date(data.datetimeutc));
        data_list.push(data);
      });
    });
    return data_list;
  }
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
                <span className={"heading"}>5 Day Forecast Quick Summary</span>
                <Stack
                  className={"weather_window"}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                >
                  <span className={"heading"}>
                    Weather Window Criteria Name
                  </span>
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
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                  >
                    <AreaChart
                      width={
                        windowWidth.current > 650
                          ? windowWidth.current - 450
                          : windowWidth.current
                      }
                      height={200}
                      data={ScrapeGraphDatas()}
                      margin={{ top: 15, right: 30, left: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="45%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="45%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="datetimeutc" ticks={[""]} />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip contentStyle={{ borderRadius: "10px" }} />
                      <Area
                        type="monotone"
                        name="Wind Speed"
                        dataKey="a_10mwindspeed"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                      />
                      <Area
                        type="monotone"
                        name="SigWave Height"
                        dataKey="sigwaveheight"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                    </AreaChart>
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
                            {TableDatas.map((datas: any) =>
                              datas
                                .slice(0, 1)
                                .map((data: any, index: number) => (
                                  <TableCell
                                    key={index}
                                    style={{
                                      padding: 0,
                                      borderRight: "1px solid #e0e0e0",
                                    }}
                                  >
                                    <div className={"mini_color_box"}>
                                      {datas.map((data: any, index: number) => (
                                        <span
                                          key={index}
                                          style={{ width: "100%" }}
                                          className={getColor(
                                            data.a_10mwindspeed
                                          )}
                                        ></span>
                                      ))}
                                    </div>
                                  </TableCell>
                                ))
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {TableDatas.map((datas: any) =>
                              datas
                                .slice(0, 1)
                                .map((data: any, index: number) => (
                                  <TableCell
                                    key={index}
                                    style={{
                                      textAlign: "center",
                                      borderRight: "1px solid #e0e0e0",
                                    }}
                                  >
                                    {dateFormat(new Date(data.datetimeutc))}
                                  </TableCell>
                                ))
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                  {TableDatas.map((datas: any) => (
                    <Paper
                      sx={{
                        width: "90%",
                        oxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        borderRadius: "15px",
                      }}
                    >
                      <TableContainer style={{ borderRadius: "15px" }}>
                        <Table stickyHeader>
                          <TableBody key={Math.random()}>
                            <TableRow key={Math.random()}>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  width: "15%",
                                  fontWeight: 500,
                                }}
                                rowSpan={datas.length + 1}
                                key={Math.random()}
                              >
                                {dateFormat(new Date(datas[0].datetimeutc))}
                              </TableCell>
                            </TableRow>
                            {datas.map((data: any, index: number) => (
                              <TableRow key={Math.random()}>
                                <TableCell
                                  className={getColor(data.a_10mwindspeed)}
                                  key={Math.random()}
                                >
                                  {new Date(data.datetimeutc).getHours() === 0
                                    ? 24
                                    : new Date(
                                        data.datetimeutc
                                      ).getHours()}{" "}
                                  UTC: {calculateWindDir(data.a_10mwinddir)}{" "}
                                  {data.a_10mwindspeed} | SIG HT{" "}
                                  {data.sigwaveheight}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  ))}
                </div>
              )}
            </div>
          </Main>
        </div>
      </Box>
    </div>
  );
}
