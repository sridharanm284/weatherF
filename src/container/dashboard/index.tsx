import { useState, useRef, useEffect } from "react";
import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { Card, Typography, Grid, Button, FormControl, Select, MenuItem } from "@mui/material";
import CardPlan from "../../components/dashboard/card";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import OperationsComponent from "../../container/login/operations/operations";
import axios from "axios";

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
  marginLeft: -drawerWidth,
  width: "100%",
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

export default function DashBoard() {
  const windowWidth = useRef(window.innerWidth);
  const [stormData, setStormData] = useState<any[]>([]);
  const [mapHovers, setMapHovers] = useState<{ [key: string]: any }>({});
  const [loadedDatas, setLoadedDatas] = useState(false);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [operationOpen, setOperationOpen] = useState(false); 
  const [clients, setClients] = useState<any[]>([]); 
  const [selectedClient, setSelectedClient] = useState(""); 
  const data = useSelector((state: any) => state?.app);

  const isAdmin = data.userRole === 'admin';

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
    if (loadedDatas) {
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_IP}api/stormdatas/`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.track_datas || !data.map_hovers) {
          setLoadedDatas(true);
          return;
        }
        setStormData(data.track_datas);
        setMapHovers(data.map_hovers);
        setLoadedDatas(true);
      })
      .catch(() => setLoadedDatas(true));
  }, [loadedDatas]);

  useEffect(() => {
    if (isAdmin) {
      axios.get(`${process.env.REACT_APP_BACKEND_IP}api/getclients/`)
        .then((response) => {
          setClients(response.data);
        })
        .catch((error) => {
          console.error("Error fetching clients:", error);
        });
    }
  }, [isAdmin]);

  const handleOpenOperations = () => {
    setOperationOpen(true);
  };

  const handleCloseOperations = () => {
    setOperationOpen(false);
  };

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full" sx={{ width: "100%" }}>
        <div className="content-wrap dashboard">
          <Main open={open} className={"main"}>
          <Button variant="contained" onClick={handleOpenOperations} className="operations-button"> 
                       Operations
                    </Button>
            <Grid container spacing={2} display={"flex"} alignItems={"start"}>
              <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                <Grid container spacing={3}>
                  <CardPlan />
                </Grid>
              </Grid>

              <Grid item xs={12} md={3} sx={{ marginBottom: "2em", height: "60vh" }} order={{ xs: 1, md: 2 }}>
                <Card style={{ height: "100%", borderRadius: "15px" }}>
                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                   
                    <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                      Active Warnings
                    </Typography>
                  </Grid>
                  {isAdmin && (
                    <Grid item xs={12} sx={{ marginTop: "20px" }} component="div">
                      <FormControl fullWidth>
                        <Select
                          value={selectedClient}
                          onChange={(e) => setSelectedClient(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Client</em>
                          </MenuItem>
                          {clients.map((client) => (
                            <MenuItem key={client.client_id} value={client.client_id}>
                              {client.client_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                    <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                      Squall Warnings
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ height: 130 }} component="div">
                    <Typography variant="body2" color="text.secondary" style={{ textAlign: "center" }}>
                      Typhoon Warnings
                    </Typography>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Main>

          {operationOpen && (
            <OperationsComponent 
              open={operationOpen} 
              close={handleCloseOperations} 
              isAdmin={isAdmin} 
            />
          )}
        </div>
      </Box>
    </div>
  );
}
