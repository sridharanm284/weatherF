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
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_IP}api/weather/`,
          { forecast_id: localStorage.getItem('fid') },
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization': 'Basic ' + btoa('admin:admin'),
            },
          }
        );
        const data = response.data;
        setCriteriaDatas(data.criteria_datas || []);
        setCriteriaDetailDatas(data.criteria_detail_datas || []);
        setTableDatas(data.datas || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table data:', error);
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

  function getColor(data: number, selectvalue: number) {
    let criteria: any = {};
    let fieldId2: any = {};
    let fieldId62: any = {};
    let operatorId: number | undefined;
    criteriaDetailDatas.forEach((c_data: any) => {
      if (parseInt(c_data.forecast_osf_criteria_id) === selectvalue) {
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
    //let isField2Red = data > criteria.value;
    let isField62Green = data <= fieldId62.margin_value;
    let isField62Yellow = data > fieldId62.margin_value && data <= criteria.value;
    //let isField62Red = data > criteria.value;
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
                    <>
                      <div key={Math.random()} className={"mini_header_box"}>
                        <div className={"mini_header_main"}>
                          <span className={"mini_header_date"}>
                            {dateFormat(new Date(datas[0].datetimeutc))}
                          </span>
                        </div>
                        <div className={"mini_header_time"}>
                          {datas.map((data: any) => (
                            <span
                              key={Math.random()}
                              className={"mini_header_time"}
                            >
                              {new Date(data.datetimeutc).getHours() === 0
                                ? 24
                                : new Date(data.datetimeutc).getHours()}
                            </span>
                          ))}
                        </div>
                        {criteriaDatas?.map((rows: any) => (
                          <>
                            <span
                              key={Math.random()}
                              style={{ textAlign: "center" }}
                            >
                              {rows.criteria_name}
                            </span>
                            <div className={"mini_color_box"}>
                              {datas.map((data: any, index: number) => (
                                <span
                                  key={Math.random()}
                                  style={{ width: "100%" }}
                                  className={getColor(
                                    data.a_10mwindspeed,
                                    parseInt(rows.forecast_osf_criteria_id)
                                  )}
                                ></span>
                              ))}
                            </div>
                          </>
                        ))}
                      </div>
                    </>
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
