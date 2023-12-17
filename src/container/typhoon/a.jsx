// import React, { useState, useRef, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import AddIcon from "@mui/icons-material/Add";
// import DoneIcon from "@mui/icons-material/Done";
// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import WeatherLoader from "../../components/loader";
// import Stack from "@mui/material/Stack";
// import store from "../../store";
// import "./styles/_index.scss";
// import { mode } from "d3";

// const drawerWidth = 0;

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
//   open?: boolean;
// }>(({ theme, open }) => ({
//   height: "82vh",
//   display: "flex",
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create("margin", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   transition: theme.transitions.create(["margin", "width"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: `${drawerWidth}px`,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

// function calculateWindDir(data: number) {
//   let calc: Array<Array<any>> = [];
//   let calcData: any = {
//     NNE: 22.5,
//     NE: 45,
//     ENE: 67.5,
//     E: 90,
//     EFE: 112.5,
//     FE: 135,
//     FFE: 157.5,
//     S: 180,
//     SSW: 202.5,
//     SW: 225,
//     WSW: 247.5,
//     W: 270,
//     WNW: 292.5,
//     NW: 315,
//     NNW: 337.5,
//     N: 360,
//   };
//   for (const d in calcData) {
//     calc.push([Math.abs(data - parseFloat(calcData[d])), d]);
//   }
//   calc.sort((x, y) => x[0] - y[0]);
//   return calc[0][1]; // Return the direction (e.g., "NNE")
// }

// const ForeCast = () => {
//   const windowWidth = useRef(window.innerWidth);
//   const [dataTable, setData] = useState("0");
//   const [tableColorDatas, setTableColorDatas] = useState<any | object>({});
//   const [tableHeader, setTableHeaders] = useState<any>([]);
//   const [forecastDatas, setForecastDatas] = useState<any>([]);
//   const [TableDatas, setTableDatas] = useState<any>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [buttonHidden, setButtonHidden] = useState<object | any>({});
//   const [selectText, setSelectText] = useState<object | any>({});
//   const [inputText, setInputText] = useState<object | any>({});
//   const [interval, setInterval] = useState<number>(3);
//   const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
//   const [loading, setLoading] = useState(true);
//   const [discussion, setDiscussion] = useState<any>("");
//   const [disDetail, setDisDetail] = useState<any>("");
//   const modelvisibility: any = [];
//   const [min, setMin] = useState<any>(0);
//   const [max, setMax] = useState<any>(0);
//   const [overViewColor, setOverViewColor] = useState<any>([]);
//   const [windCondition, setWindCondition] = useState<any>();
//   const [fullWeather, setFullWeather] = useState<any>();
//   const [twoWeather, setTwoWeather] = useState<any>();
//   const [oneWeather, setOneWeather] = useState<any>();

//   const [criteriaDatas, setCriteriaDatas] = useState<any>([]);
//   const [criteriaDetailDatas, setCriteriaDetailDatas] = useState<any>([
//     "white",
//   ]);
//   const [SelectValue, setSelectValue] = useState<any>("");
//   const data = useSelector((state: any) => state?.app);

//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   useEffect(() => {
//     store.dispatch({
//       type: "TOGGLE_MENU",
//       payload: windowWidth.current > 1000 ? true : false,
//     });
//   }, []);

//   useEffect(() => {
//     setOpen(data.toggle);
//   }, [data]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/overview/", {
//       method: "POST",
//       body: JSON.stringify({ forecast_id: localStorage.getItem("fid") }),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         Authorization: "Basic " + btoa("admin:admin"),
//       },
//       cache: "no-cache",
//     })
//       .then((response) => {
//         return response.json();
//       })
//       .then((data) => {
//         setCriteriaDatas(data.criteria_datas);
//         setCriteriaDetailDatas(data.criteria_detail_datas);
//         setSelectValue(
//           String(data.criteria_detail_datas[0].forecast_osf_criteria_id)
//         );
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.log("Cannot Fetch Table Datas");
//       });
//   }, []);

//   function checkForExistence(array: any, data: any) {
//     for (let i = 0; i < array.length; i++) {
//       if (array[i].name == data) return true;
//     }
//     return false;
//   }

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/forecast/", {
//       method: "POST",
//       body: JSON.stringify({ forecast_id: localStorage.getItem("fid") }),
//       headers: { "Content-type": "application/json; charset=UTF-8" },
//       cache: "no-cache",
//     })
//       .then((response) => response.json())
//       .then(async (data) => {
//         await setTableHeaders(data.headers);
//         await setForecastDatas(data.datas);
//         await setTableDatas(data.datas);
//         await setInterval(data.interval);
//         await setDiscussion(data.discussion.discussion);
//         await setDisDetail(data.discussion.discussion_detail);
//         await setLoading(false);
//         await console.log("TH", tableHeader);
//         await console.log("Data", TableDatas[0][0]);
//         await setWindCondition(TableDatas[0][0].a_100mwindspeed);

//         await console.log(tableHeader, TableDatas, "TableHeadrers");

//         if (
//           checkForExistence(tableHeader, "cloudbase") &&
//           checkForExistence(tableHeader, "modelvisibility") &&
//           checkForExistence(tableHeader, "rainrate")
//         ) {
//           setFullWeather(true);
//           console.log("Full weather");
//         } else if (
//           (checkForExistence(tableHeader, "cloudbase") &&
//             checkForExistence(tableHeader, "modelvisibility")) ||
//           (checkForExistence(tableHeader, "cloudbase") &&
//             checkForExistence(tableHeader, "rainrate")) ||
//           (checkForExistence(tableHeader, "modelvisibility") &&
//             checkForExistence(tableHeader, "rainrate"))
//         ) {
//           setTwoWeather(true);
//           console.log("two");
//         } else if (
//           checkForExistence(tableHeader, "cloudbase") ||
//           checkForExistence(tableHeader, "modelvisibility") ||
//           checkForExistence(tableHeader, "rainrate")
//         ) {
//           setOneWeather(true);
//           console.log("one");
//         } else {
//           console.log(
//             "No weather data found",
//             checkForExistence(tableHeader, "cloudbase")
//           );
//         }
//       })
//       .catch((error) => console.log("Cannot Fetch Table Datas"));
//   }, [fullWeather, oneWeather, twoWeather, loading]);

//   useEffect(() => {
//     var datas = TableDatas;
//     TableDatas.map((date: any) => {
//       date.map((element: any) => {
//         setOverViewColor((prevOverViewColor: any) => [
//           ...prevOverViewColor,
//           "",
//         ]);
//       });
//     });
//     datas.forEach((element: any) => {
//       element.forEach((ele: any) => {
//         ele.modelvisibility !== undefined
//           ? modelvisibility.push(ele.modelvisibility)
//           : modelvisibility.push(0);
//       });
//     });
//     setMin(Math.floor(Math.min(...modelvisibility)));
//     setMax(Math.floor(Math.max(...modelvisibility)));
//   }, [TableDatas]);

//   function analysetheData(arg: string, text: string, mode: string) {
//     let table: any = { ...tableColorDatas };
//     for (const data in table) {
//       if (data.slice(6).split("").slice(0, -1).join("") === arg) {
//         delete table[data];
//       }
//     }
//     setTableColorDatas(table);
//     let total_index = 0;
//     TableDatas.forEach((datas: any) => {
//       for (const eachinner in datas) {
//         let boolean_value = false;
//         let color = null;
//         if (mode === ">=") {
//           color = "green";
//           boolean_value = datas[eachinner][arg] >= parseFloat(text);
//         } else if (mode === "<=") {
//           color = "blue";
//           boolean_value = datas[eachinner][arg] <= parseFloat(text);
//         }
//         if (boolean_value) {
//           table["color_" + arg + "_" + total_index] = color;
//         }
//         total_index += 1;
//       }
//     });
//     setTableColorDatas(table);
//   }

//   function Dateformat(celldata: any) {
//     const [datePart, timePart] = celldata.split(" ");
//     const [day, month, year] = datePart.split("/").map(Number);
//     const [hour, minute] = timePart.split(":").map(Number);
//     const dateObject = new Date(year, month - 1, day, hour, minute);
//     const inputDate = dateObject;
//     const dayc = dayNames[inputDate.getUTCDay()];
//     const monthc = monthNames[inputDate.getUTCMonth()];
//     const yearc = inputDate.getUTCFullYear();
//     if (day === undefined) {
//       return celldata;
//     }
//     return `${dayc}, ${inputDate.getUTCDate()} ${monthc} ${yearc}`;
//   }

//   useEffect(() => {
//     // Initialize a new array for colors
//     const newColorArray: any = [];
//     setOverViewColor([]);
//     TableDatas.forEach((date: any) => {
//       date.forEach((element: any) => {
//         let data = parseFloat(element.a_10mwindspeed);
//         var criteria: any = {};
//         criteriaDetailDatas.forEach((c_data: any) => {
//           if (c_data.forecast_osf_criteria_id === parseInt(SelectValue)) {
//             criteria = c_data;
//           }
//         });

//         if (
//           (data >= criteria.value && data <= criteria.margin_value) ||
//           (data <= criteria.value && data >= criteria.margin_value)
//         ) {
//           let color = "yellow_overview";
//           newColorArray.push(color);
//         } else if (data > criteria.value && data > criteria.margin_value) {
//           let color = "red_overview";
//           newColorArray.push(color);
//         } else if (data < criteria.value && data < criteria.margin_value) {
//           let color = "green_overview";
//           newColorArray.push(color);
//         } else {
//           newColorArray.push("white");
//         }
//       });
//     });
//     setOverViewColor(newColorArray);
//     console.log(overViewColor);
//   }, [SelectValue]);

//   let incr = 0;
//   function ScrapeDatas(datas: any, index: number) {
//     let total_index = index;
//     var dict: any = [];
//     var dates: any = [];
//     for (const data_array in datas) {
//       var dict_temp: any = [];
//       for (const data in datas[data_array]) {
//         let cellData = datas[data_array][data];
//         if (data === "a_10mwinddir") {
//           // Calculate the wind direction using the calculateWindDir function
//           cellData = calculateWindDir(datas[data_array][data]);
//         }
//         var weatherDate = new Date(cellData);
//         dates.push(weatherDate);
//         {
//           typeof weatherDate === "object" &&
//           typeof cellData === "string" &&
//           cellData.length === 16 &&
//           !dates.indexOf(weatherDate) ? (
//             <>
//               {dict.push(
//                 <TableRow>
//                   <TableCell
//                     style={{ textAlign: "center" }}
//                     className={
//                       data === "datetimeutc"
//                         ? "date"
//                         : `${
//                             tableColorDatas[
//                               "color_" + data + "_" + total_index
//                             ] === undefined
//                               ? ""
//                               : tableColorDatas[
//                                   "color_" + data + "_" + total_index
//                                 ]
//                           }`
//                     }
//                     key={Math.random()}
//                     colSpan={16}
//                   >
//                     {cellData === null || cellData === undefined
//                       ? "-"
//                       : Dateformat(cellData)}
//                   </TableCell>
//                 </TableRow>
//               )}
//               {dict_temp.push(
//                 <TableCell
//                   className={
//                     data === "datetimeutc"
//                       ? "date"
//                       : `${
//                           tableColorDatas[
//                             "color_" + data + "_" + total_index
//                           ] === undefined
//                             ? ""
//                             : tableColorDatas[
//                                 "color_" + data + "_" + total_index
//                               ]
//                         }`
//                   }
//                   key={Math.random()}
//                 >
//                   {cellData === null || cellData === undefined ? (
//                     "-"
//                   ) : (
//                     <div style={{ display: "flex", gap: "8px" }}>
//                       <div
//                         style={{
//                           width: "20px",
//                           height: "20px",
//                           borderRadius: "3px",
//                         }}
//                         className={overViewColor[incr]}
//                       ></div>
//                       {cellData.slice(10)}
//                     </div>
//                   )}
//                 </TableCell>
//               )}
//             </>
//           ) : (
//             dict_temp.push(
//               <TableCell
//                 className={
//                   data === "datetimeutc"
//                     ? "date"
//                     : `${
//                         tableColorDatas["color_" + data + "_" + total_index] ===
//                         undefined
//                           ? ""
//                           : tableColorDatas["color_" + data + "_" + total_index]
//                       }`
//                 }
//                 key={Math.random()}
//               >
//                 {cellData === null || cellData === undefined ? (
//                   "-"
//                 ) : typeof cellData === "string" && cellData.length === 16 ? (
//                   <div style={{ display: "flex", gap: "8px" }}>
//                     <div
//                       style={{
//                         width: "20px",
//                         height: "20px",
//                         borderRadius: "3px",
//                       }}
//                       className={overViewColor[incr]}
//                     ></div>
//                     {cellData.slice(10)}
//                   </div>
//                 ) : (
//                   cellData
//                 )}
//               </TableCell>
//             )
//           );
//         }
//       }
//       dict.push(
//         <TableRow key={Math.random()}>{dict_temp.map((s: any) => s)}</TableRow>
//       );
//       total_index += 1;
//       incr += 1;
//     }
//     return dict;
//   }

//   function ScrapeDatas2() {
//     let total_index = 0;
//     let dict: any = [];
//     TableDatas.forEach((data: any) => {
//       ScrapeDatas(data, total_index).forEach((d: any) => {
//         dict.push(d);
//         total_index += 1;
//       });
//     });
//     return dict.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
//   }

//   function GetTotalDatasCount() {
//     let total_index = 0;
//     TableDatas.forEach((data: any) => {
//       total_index += data.length;
//     });
//     return total_index;
//   }

//   const handleChange = (event: SelectChangeEvent<typeof dataTable>) => {
//     setData(event.target.value);
//     setTableColorDatas({});
//     if (parseInt(event.target.value) === 0) {
//       setTableDatas(forecastDatas);
//       return;
//     }
//     var dict: any = [];
//     forecastDatas.forEach((datas: any) => {
//       var dict_temp: any = [];
//       for (const data_array in datas) {
//         let datetimeobj: any = new Date(datas[data_array].datetimeutc);
//         if (datetimeobj.toString() === "Invalid Date") {
//           const d = datas[data_array].datetimeutc.split("/");
//           const date = d.shift();
//           const month = d.shift();
//           d.unshift(date);
//           d.unshift(month);
//           datetimeobj = new Date(d.join("/"));
//         }
//         datetimeobj = datetimeobj.getHours();
//         if (datetimeobj === 0) {
//           datetimeobj = 24;
//         }
//         if (parseInt(event.target.value) === 0) {
//           dict_temp.push(datas[data_array]);
//         } else if (
//           datetimeobj % parseInt(event.target.value) === 0 &&
//           datetimeobj !== 0
//         ) {
//           dict_temp.push(datas[data_array]);
//         }
//       }
//       dict.push(dict_temp);
//     });
//     setTableDatas(dict);
//     setPage(0);
//   };

//   function TableTitle(props: any) {
//     const [localInputText, setLocalInputText] = useState(
//       inputText[props.caption] === undefined ? "" : inputText[props.caption]
//     );
//     const [localSelect, setLocalSelect] = useState(
//       selectText[props.caption] === undefined ? ">=" : selectText[props.caption]
//     );
//     return (
//       <div className={"tableTitlediv"}>
//         <div className={"tableTitleDivinner"}>
//           <span className={"tableTitle"}>{props.caption}</span>
//           <span className={"tableSubTitle"}>{props.subCaption}</span>
//         </div>
//         {props.name !== "datetimeutc" ? (
//           <>
//             <div
//               className={"tableButtons"}
//               style={{
//                 opacity: props.caption === "10m Wind Dir" ? 0 : 1,
//               }}
//             >
//               <button
//                 disabled={props.caption === "10m Wind Dir"}
//                 onClick={(event) => {
//                   let buttons = { ...buttonHidden };
//                   buttons[props.caption] = true;
//                   setButtonHidden(buttons);
//                 }}
//                 style={{
//                   display: !buttonHidden[props.caption] ? "contents" : "none",
//                 }}
//               >
//                 <AddIcon
//                   style={{ color: "black", cursor: "pointer" }}
//                   fontSize="small"
//                 />
//               </button>
//               <select
//                 value={localSelect}
//                 style={{ display: buttonHidden[props.caption] ? "" : "none" }}
//                 onChange={(text) => setLocalSelect(text.target.value)}
//               >
//                 <option value=">=">{">="}</option>
//                 <option value="<=">{"<="}</option>
//               </select>
//               <input
//                 style={{ display: buttonHidden[props.caption] ? "" : "none" }}
//                 value={localInputText}
//                 onChange={(text) => setLocalInputText(text.target.value)}
//               ></input>
//               <button
//                 style={{ display: buttonHidden[props.caption] ? "" : "none" }}
//                 onClick={(event) => {
//                   let select = { ...selectText };
//                   select[props.caption] = localSelect;
//                   setSelectText(select);
//                   let inputtext = { ...inputText };
//                   inputtext[props.caption] = localInputText;
//                   setInputText(inputtext);
//                   analysetheData(props.name, localInputText, localSelect);
//                 }}
//               >
//                 <DoneIcon style={{ color: "black" }} fontSize="small" />
//               </button>
//             </div>
//           </>
//         ) : (
//           ""
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className={open ? "sideNavOpen" : "sideNavClose"}>
//       <Box className="fug-container bg-default flex sidenav-full">
//         <div className="content-wrap page-forecast">
//           <div
//             className="discussion-content"
//             style={{ marginBottom: -30, marginTop: "-16px", padding: "20px" }}
//           >
//             <Table
//               style={{
//                 background: "white",
//                 borderRadius: "20px",
//                 boxShadow: "2px, 2px, 2px black",
//               }}
//             >
//               <TableRow>
//                                {" "}
//                 <TableCell>
//                   Synopsis Summary:  {" "}
//                   {discussion.synopsis !== undefined
//                     ? discussion.synopsis
//                     : "-"}
//                 </TableCell>
//                              {" "}
//               </TableRow>
//                            {" "}
//               <TableRow>
//                                {" "}
//                 <TableCell>
//                   Tropical Adivosy:{" "}
//                   {discussion.advisory !== undefined
//                     ? discussion.advisory
//                     : "-"}
//                 </TableCell>
//                              {" "}
//               </TableRow>
//                            {" "}
//               <TableRow>
//                                {" "}
//                 <TableCell>
//                   Warning:{" "}
//                   {discussion.warning !== undefined ? discussion.warning : "-"}
//                 </TableCell>
//                              {" "}
//               </TableRow>
//                            {" "}
//               <TableRow>
//                                {" "}
//                 <TableCell>
//                   Notes:{" "}
//                   {discussion.notes !== undefined ? discussion.notes : "-"}
//                 </TableCell>
//                                {" "}
//                 <TableCell>
//                                    {" "}
//                   <TableRow
//                     style={{
//                       marginTop: "0px",
//                       padding: "0px",
//                     }}
//                   >
//                                        {" "}
//                     <TableCell>
//                                            {" "}
//                       {disDetail && disDetail.other_text_title !== undefined
//                         ? disDetail.other_text_title
//                         : "Discussion Title"}
//                                          {" "}
//                     </TableCell>
//                                        {" "}
//                     <TableCell>
//                                            {" "}
//                       {disDetail &&
//                       disDetail.other_text_description !== undefined
//                         ? disDetail.other_text_description
//                         : "Discussion Description"}
//                                          {" "}
//                     </TableCell>
//                                      {" "}
//                   </TableRow>
//                                    {" "}
//                   <TableRow>
//                                        {" "}
//                     <TableCell>
//                       Visibility:   {min} - {max} km{" "}
//                     </TableCell>
//                                      {" "}
//                   </TableRow>
//                                  {" "}
//                 </TableCell>
//                              {" "}
//               </TableRow>
//             </Table>
//           </div>
//           <Main open={open} className={"main"} style={{ overflow: "auto" }}>
//             {loading ? (
//               <div className={"loader-div"}>
//                 <WeatherLoader />
//               </div>
//             ) : (
//               <div className={"container-section"}>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-start",
//                   }}
//                   className={"forecast-div"}
//                 >
//                   <h4 className={"forcast-header"}>Timestamp</h4>
//                   <div
//                     style={{ display: "flex", alignItems: "center", gap: 10 }}
//                   >
//                     <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
//                       <Select
//                         labelId="model-data"
//                         id="model-data"
//                         value={dataTable}
//                         onChange={handleChange}
//                         style={{
//                           backgroundColor: "white",
//                           borderRadius: "10px",
//                           textAlign: "center",
//                         }}
//                       >
//                         <MenuItem value={0}>All</MenuItem>
//                         {[3, 6, 12, 24]
//                           .slice([3, 6, 12, 24].indexOf(interval))
//                           .map((s) => (
//                             <MenuItem key={Math.random()} value={s}>
//                               {s} hours Data
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     </FormControl>
//                     <FormControl
//                       sx={{ m: 1, minWidth: 180, minHeight: 10 }}
//                       size="small"
//                     >
//                       <Select
//                         labelId="model-data"
//                         id="model-data"
//                         value={SelectValue}
//                         onChange={(s) => {
//                           if (s.target.value === "No datas Available") {
//                             return;
//                           }
//                           setSelectValue(s.target.value);
//                         }}
//                         style={{
//                           backgroundColor: "white",
//                           borderRadius: "10px",
//                           textAlign: "center",
//                           fontSize: 15,
//                         }}
//                       >
//                         {criteriaDatas.length === 0 ? (
//                           <MenuItem value="No datas Available">
//                             No datas Available
//                           </MenuItem>
//                         ) : (
//                           criteriaDatas.map((data: any) => (
//                             <MenuItem
//                               key={data.forecast_osf_criteria_id}
//                               value={data.forecast_osf_criteria_id}
//                             >
//                               {data.criteria_name}
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                     </FormControl>
//                   </div>
//                 </div>
//                 <Paper sx={{ width: "100%", overflow: "hidden" }}>
//                   <TableContainer sx={{ maxHeight: "100%" }}>
//                     <Table stickyHeader >
//                       <TableHead>
//                         <TableRow 
//                           style={{
//                             position: "sticky",
//                             top: 0,
//                             background: "#eaeaeb",
//                           }}
//                         >
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderLeft: "0.5px solid gray",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                           >
//                             LocalTime
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderLeft: "0.5px solid gray",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={{ windCondition } ? 5 : 4}
//                           >
//                             Winds
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderLeft: "0.5px solid gray",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={2}
//                           >
//                             Wind Waves
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={1}
//                           >
//                             +
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={1}
//                           >
//                             Swell
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={1}
//                           >
//                             +
//                           </TableCell>
//                           <TableCell
//                             style={{
//                               minWidth: 115,
//                               background: "#eaeaeb",
//                               color: "#192b3c",
//                               borderTop: "0.5px solid gray",
//                               borderBottom: "0.5px solid gray",
//                               textAlign: "center",
//                               fontWeight: "bolder",
//                             }}
//                             colSpan={
//                               { fullWeather }
//                                 ? 2
//                                 : { twoWeather }
//                                 ? 1
//                                 : { oneWeather }
//                                 ? 0
//                                 : 2
//                             }
//                           >
//                             Total Sea
//                           </TableCell>
//                           {fullWeather || twoWeather || oneWeather ? (
//                             <TableCell
//                               style={{
//                                 minWidth: 115,
//                                 background: "#eaeaeb",
//                                 color: "#192b3c",
//                                 borderLeft: "0.5px solid gray",
//                                 borderTop: "0.5px solid gray",
//                                 borderBottom: "0.5px solid gray",
//                                 textAlign: "center",
//                                 fontWeight: "bolder",
//                               }}
//                               colSpan={
//                                 { fullWeather }
//                                   ? 3
//                                   : { twoWeather }
//                                   ? 2
//                                   : { oneWeather }
//                                   ? 1
//                                   : 1
//                               }
//                             >
//                               Weather
//                             </TableCell>
//                           ) : null}
//                         </TableRow>
//                         <TableRow>
//                           {tableHeader.map((column: any, index: number) => {
//                             const replace =
//                               column.output_unit_name === "kts" ||
//                               column.ud_unit_name === "kt"
//                                 ? "kn"
//                                 : column.ud_unit_name === "None"
//                                 ? " - "
//                                 : column.ud_unit_name;
//                             return (
//                               <TableCell
//                                 key={column.name}
//                                 style={{
//                                   minWidth: 115,
//                                   background: "#eaeaeb",
//                                   color: "#192b3c",
//                                   borderRight: "1px solid #e0e0e0",
//                                   textAlign: "center",
//                                 }}
//                                 className={
//                                   column.name === "datetimeutc"
//                                     ? "date"
//                                     : tableColorDatas[
//                                         "color_" + column.name + "_" + index
//                                       ] === undefined
//                                     ? ""
//                                     : tableColorDatas[
//                                         "color_" + column.name + "_" + index
//                                       ]
//                                 }
//                               >
//                                 <TableTitle
//                                   key={Math.random()}
//                                   caption={
//                                     column.caption === "Time"
//                                       ? "(GST+8)"
//                                       : column.caption
//                                   }
//                                   subCaption={replace}
//                                   name={
//                                     column.name == "Time"
//                                       ? "(GST+8)"
//                                       : column.name
//                                   }
//                                   total_index={index}
//                                 />
//                               </TableCell>
//                             );
//                           })}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>{ScrapeDatas2().map((d: any) => d)}</TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     rowsPerPageOptions={[5, 10, 15, 20, 25]}
//                     component="div"
//                     count={GetTotalDatasCount()}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={(event, page) => setPage(page)}
//                     onRowsPerPageChange={(event) => {
//                       setRowsPerPage(+event.target.value);
//                       setPage(0);
//                     }}
//                   />
//                 </Paper>
//               </div>
//             )}
//           </Main>
//         </div>
//       </Box>
//     </div>
//   );
// };

// export default ForeCast;
