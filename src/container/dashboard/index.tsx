import { useState, useRef, useEffect } from "react";
import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Card,
  Typography,
  Grid,
  Button,

} from "@mui/material";
import CardPlan from "../../components/dashboard/card";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import OperationsComponent from "../login/operations/operations";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [open, setOpen] = useState(windowWidth.current > 1000);
  const [operationOpen, setOperationOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const data = useSelector((state: any) => state?.app);
  const isAdmin = localStorage.getItem("type") === "admin";

  const navigate = useNavigate();

  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  useEffect(() => {
    if (!loadedDatas) {
      fetch(`${process.env.REACT_APP_BACKEND_IP}api/stormdatas/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.track_datas && data.map_hovers) {
            setStormData(data.track_datas);
            setMapHovers(data.map_hovers);
          }
          setLoadedDatas(true);
        })
        .catch(() => setLoadedDatas(true));
    }
  }, [loadedDatas]);

  useEffect(() => {
    if (isAdmin) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_IP}api/getclients/`)
        .then((response) => setClients(response.data))
        .catch((error) => console.error("Error fetching clients:", error));
    }
  }, [isAdmin]);

  const closeOperations = () => {
    setOperationOpen(false);
    window.location.href = "/dashboard";
  };

  const handleOpenOperations = () => {
    setOperationOpen(true);
  };

  const handleCloseOperations = () => setOperationOpen(false);

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box
        className="fug-container bg-default flex sidenav-full"
        sx={{ width: "100%" }}
      >
        <div className="content-wrap dashboard">
          <Main open={open} className="main">
            <Grid container spacing={2} display="flex" alignItems="start">
              <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                <Grid container spacing={3}>
                  <CardPlan />
                </Grid>
              </Grid>

              {operationOpen && (
                <OperationsComponent
                  isAdmin={isAdmin}
                  open={operationOpen}
                  close={closeOperations}
                />
              )}

              <Grid
                item
                xs={12}
                md={3}
                sx={{ marginBottom: "2em", height: "60vh" }}
                order={{ xs: 1, md: 2 }}
              >
                <Card style={{ height: "100%", borderRadius: "15px" }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleOpenOperations}
                      className="operations-button"
                    >
                      Operations
                    </Button>
                  </div>

                  <Grid item xs={12} sx={{ height: 130 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Active Warnings
                    </Typography>
                  </Grid>

                  {/* {isAdmin && (
                    <Grid item xs={12} sx={{ marginTop: "20px" }}>
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
                            <MenuItem
                              key={client.client_id}
                              value={client.client_id}
                            >
                              {client.client_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )} */}

                  <Grid item xs={12} sx={{ height: 130 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Squall Warnings
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sx={{ height: 130, overflowY: "auto" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      gutterBottom
                    >
                      Typhoon Warnings
                    </Typography>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Main>
        </div>
      </Box>
    </div>
  );
}
