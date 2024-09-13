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
  const windowWidths = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidths.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);

  const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
  const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([]);
  const [TableDatas, setTableDatas] = useState<any>([]);
  const [SelectValue, setSelectValue] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_IP}api/overview/`,
          { forecast_id: localStorage.getItem("fid") },
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Authorization: "Basic " + btoa("admin:admin"),
            },
          }
        );
        const data = response.data;
        setCriteriaDatas(data.criteria_datas || []);
        setCriteriaDetailDatas(data.criteria_detail_datas || []);
        setTableDatas(data.datas || []);
        setSelectValue(
          String(data.criteria_detail_datas[0]?.forecast_osf_criteria_id || "")
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

  function dateformatting(date: any) {
    var day = date.slice(0, 2);
    var month = date.slice(3, 5);
    var remain = date.slice(6);
    var newdate = day + "/" + month + "/" + remain;
    return new Date(newdate);
  }

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
    return calc[0][calc[0].length - 1];
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
                    direction={{ xs: "column", sm: direction }}
                    spacing={1}
                    sx={{
                      alignItems: windowWidth <= 650 ? "center" : "initial",
                    }}
                  >
                    <AreaChart
                      width={
                        windowWidth > 650 ? windowWidth - 450 : windowWidth
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
                      <XAxis
                        dataKey="datetimeutc"
                        ticks={[""]}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        interval={0}
                        padding={{ left: 20, right: 20 }}
                        tickFormatter={(value, index) => {
                          if (index % 2 === 0) {
                            return value;
                          }
                          return "";
                        }}
                      />
                      <XAxis
                        orientation="top"
                        dataKey="sigwaveheight"
                        ticks={[0, 0.5, 1, 1.5, 2]}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        interval={0}
                        padding={{ left: 20, right: 20 }}
                        tickFormatter={(value, index) => {
                          return `${value} m`;
                        }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        ticks={[0, 0.5, 1, 1.5, 2]}
                        tickFormatter={(value, index) => {
                          return `${value}`;
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip contentStyle={{ borderRadius: "10px" }} />
                      <Area
                        type="monotone"
                        name="Wind Speed"
                        dataKey="a_10mwindspeed"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        yAxisId="left"
                      />
                      <Area
                        type="monotone"
                        name="SigWave Height"
                        dataKey="sigwaveheight"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                        yAxisId="right"
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
                                    {dateFormat(
                                      dateformatting(data.datetimeutc)
                                    )}
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
                                {dateFormat(
                                  dateformatting(datas[0].datetimeutc)
                                )}
                              </TableCell>
                            </TableRow>
                            {datas.map((data: any, index: number) => (
                              <TableRow key={Math.random()}>
                                <TableCell
                                  className={getColor(data.a_10mwindspeed)}
                                  key={Math.random()}
                                >
                                  {dateformatting(
                                    data.datetimeutc
                                  ).getHours() === 0 ? (
                                    24
                                  ) : (
                                    <>
                                      {" "}
                                      {dateformatting(
                                        data.datetimeutc
                                      ).getHours()}
                                      :
                                      {dateformatting(
                                        data.datetimeutc
                                      ).getMinutes() === 0
                                        ? "00"
                                        : dateformatting(
                                            data.datetimeutc
                                          ).getMinutes()}{" "}
                                    </>
                                  )}
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
