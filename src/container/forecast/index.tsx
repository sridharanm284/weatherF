import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import WeatherLoader from "../../components/loader";
import store from "../../store";
import "./styles/_index.scss";

const drawerWidth = 0;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  height: '82vh',
  display: 'flex',
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
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
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
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
  const [dataTable, setData] = useState('0');
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
  const data = useSelector((state: any) => state?.app);

  useEffect(() => {
    store.dispatch({ type: 'TOGGLE_MENU', payload: windowWidth.current > 1000 ? true : false });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/forecast/', { method: 'POST', body: JSON.stringify({ forecast_id: localStorage.getItem('fid') }), headers: { 'Content-type': 'application/json; charset=UTF-8' }, cache: 'no-cache' })
       .then(response => response.json())
       .then(data => {
        setTableHeaders(data.headers);
        setForecastDatas(data.datas);
        setTableDatas(data.datas);
        setInterval(data.interval);
        setLoading(false);
      })
      .catch(error => console.log("Cannot Fetch Table Datas"));
      

}, []);

  function analysetheData(arg: string, text: string, mode: string) {
    let table: any = { ...tableColorDatas };
    for (const data in table) {
      if (data.slice(6).split('_').slice(0, -1).join("_") === arg) {
        delete table[data];
      }
    }
    setTableColorDatas(table);
    let total_index = 0;
    TableDatas.forEach((datas: any) => {
      for (const eachinner in datas) {
        let boolean_value = false;
        let color = null;
        if (mode === ">=") {
          color = 'green';
          boolean_value = (datas[eachinner][arg] >= parseFloat(text));
        } else if (mode === "<=") {
          color = 'blue';
          boolean_value = (datas[eachinner][arg] <= parseFloat(text));
        }
        if (boolean_value) {
          table['color_' + arg + '_' + total_index] = color;
        }
        total_index += 1;
      }
    });
    setTableColorDatas(table);
  }

  function ScrapeDatas(datas: any, index: number) {
    let total_index = index;
    var dict: any = [];
    for (const data_array in datas) {
      var dict_temp: any = [];
      for (const data in datas[data_array]) {
        let cellData = datas[data_array][data];
        if (data === "a_10mwinddir") {
          // Calculate the wind direction using the calculateWindDir function
          cellData = calculateWindDir(datas[data_array][data]);
        }
        dict_temp.push(
          <TableCell
            style={{ textAlign: "center", borderRight: "1px solid #e0e0e0" }}
            className={
              data === "datetimeutc"
                ? "date"
                : `${tableColorDatas["color_" + data + "_" + total_index] === undefined ? "" : tableColorDatas["color_" + data + "_" + total_index]}`
            }
            key={Math.random()}
          >
            {cellData === null ? "-" : cellData.toLocaleString('en-US')}
          </TableCell>
        );
      }
      dict.push(<TableRow key={Math.random()}>{dict_temp.map((s: any) => s)}</TableRow>);
      total_index += 1;
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
    setTableColorDatas({});
    if (parseInt(event.target.value) === 0) {
      setTableDatas(forecastDatas);
      return;
    }
    var dict: any = [];
    forecastDatas.forEach((datas: any) => {
      var dict_temp: any = [];
      for (const data_array in datas) {
        let datetimeobj: any = new Date(datas[data_array].datetimeutc)
        if (datetimeobj.toString() === "Invalid Date") {
          const d = datas[data_array].datetimeutc.split('/')
          const date = d.shift()
          const month = d.shift()
          d.unshift(date)
          d.unshift(month)
          datetimeobj = new Date(d.join('/'));    
        }
        datetimeobj = datetimeobj.getHours();
        if (datetimeobj === 0) {
          datetimeobj = 24;
        }
        if (parseInt(event.target.value) === 0) {
          dict_temp.push(datas[data_array]);
        } else if (((datetimeobj % parseInt(event.target.value)) === 0) && (datetimeobj !== 0)) {
          dict_temp.push(datas[data_array]);
        }
      }
      dict.push(dict_temp);
    });
    setTableDatas(dict);
    setPage(0);
  };

  function TableTitle(props: any) {
    const [localInputText, setLocalInputText] = useState(inputText[props.caption] === undefined ? '' : inputText[props.caption]);
    const [localSelect, setLocalSelect] = useState(selectText[props.caption] === undefined ? '>=' : selectText[props.caption]);
    return (
      <div className={"tableTitlediv"}>
        <div className={'tableTitleDivinner'}>
          <span className={"tableTitle"}>{props.caption}</span>
          <span className={"tableSubTitle"}>{props.subCaption}</span>
        </div>
        {(props.name !== 'datetimeutc') ?
          <>
            <div className={"tableButtons"}
              style={{
                opacity: (props.caption === '10m Wind Dir') ? 0 : 1
              }}>
              <button
                disabled={(props.caption === '10m Wind Dir')}
                onClick={(event) => {
                  let buttons = { ...buttonHidden };
                  buttons[props.caption] = true;
                  setButtonHidden(buttons);
                }}
                style={{
                  display: !buttonHidden[props.caption] ? 'contents' : 'none',
                  cursor: (props.caption === '10m Wind Dir') ? 'initial' : 'pointer' 
                }}>
                <AddIcon
                  style={{ color: 'black', cursor: 'pointer' }}
                  fontSize='small'
                />
              </button>
              <select value={localSelect} style={{ display: (buttonHidden[props.caption] ? '' : 'none') }} onChange={text => setLocalSelect(text.target.value)}>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
              </select>
              <input style={{ display: (buttonHidden[props.caption] ? '' : 'none') }} value={localInputText} onChange={text => setLocalInputText(text.target.value)}></input>
              <button style={{ display: (buttonHidden[props.caption] ? '' : 'none') }} onClick={event => { let select = { ...selectText }; select[props.caption] = localSelect; setSelectText(select); let inputtext = { ...inputText }; inputtext[props.caption] = localInputText; setInputText(inputtext); analysetheData(props.name, localInputText, localSelect); }}><DoneIcon style={{ color: 'black' }} fontSize="small" /></button>
            </div>
          </>
          : ''}
      </div>
    )
  }

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="ailevate-container bg-default flex sidenav-full">
        <div className="content-wrap page-forecast">
          <Main open={open} className={"main"} style={{ overflow: 'auto' }}>
            {(loading) ?
              <div className={'loader-div'}>
                <WeatherLoader />
              </div>
              :
              <div className={"container-section"}>
                <div className={'forecast-div'}>
                  <h4 className={'forcast-header'}>Timestamp</h4>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <Select
                      labelId="model-data"
                      id="model-data"
                      value={dataTable}
                      onChange={handleChange}
                      style={{ backgroundColor: 'white', borderRadius: '10px', textAlign: 'center' }}
                    >
                      <MenuItem value={0}>All</MenuItem>
                      {[3, 6, 12, 24].slice([3, 6, 12, 24].indexOf(interval)).map(s => <MenuItem value={s}>Last {s} hours Data</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: "90%" }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          {tableHeader.map((column: any, index: number) => {
                            const replace =
                              column.output_unit_name === "kts" || column.ud_unit_name === "kt"
                                ? "kn"
                                : column.ud_unit_name === "None"
                                ? " - "
                                : column.ud_unit_name;
                            return (
                              <TableCell
                                key={column.name}
                                style={{
                                  minWidth: 115,
                                  background: "#eaeaeb",
                                  color: "#192b3c",
                                  borderRight: "1px solid #e0e0e0",
                                  textAlign: "center",
                                }}
                                className={
                                  column.name === "datetimeutc"
                                    ? "date"
                                    : tableColorDatas["color_" + column.name + "_" + index] === undefined
                                    ? ""
                                    : tableColorDatas["color_" + column.name + "_" + index]
                                }
                              >
                                <TableTitle key={Math.random()} caption={column.caption} subCaption={replace} name={column.name} total_index={index} />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ScrapeDatas2().map((d: any) => d)}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20, 25]}
                    component="div"
                    count={GetTotalDatasCount()}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, page) => setPage(page)}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPage(+event.target.value);
                      setPage(0);
                    }}
                  />
                </Paper>
              </div>
            }
          </Main>
        </div>
      </Box>
    </div>
  );
}

export default ForeCast;
