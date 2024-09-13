import React, { useEffect, useState } from "react";
import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import AirIcon from "@mui/icons-material/Air";
import StormIcon from "@mui/icons-material/Storm";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import SendIcon from "@mui/icons-material/Send";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import logoMain from "./../../assets/logoMain.png";
import useWebSocket from "react-use-websocket";

interface ChatMessage {
  id: number;
  file: string;
  user_type: string;
  imgfile: string;
  file_name: any;
  date_time: string;
  message: string;
  user: string;
}

interface CountRoom {
  unread_admin: number;
}

const SideNavMenu = (props: any) => {
  const [location, setLocation] = useState(window.location);
  const [countAdmin, setcountAdmin] = useState(0);
  const [countUser, setcountUser] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState<number>(0);
  const [messageCount, setmessageCount] = useState(0);
  const [socketOpened, setSocketOpened] = useState(false);
  const socketUrl = `ws://${process.env.REACT_APP_BACKEND_IP}ws/chat/${localStorage.getItem(
    "user_id"
  )}/`;
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      setSocketOpened(true);
      sendJsonMessage({
        mode: "sidebar",
        token: localStorage.getItem("token"),
        user_type: localStorage.getItem("type"),
        user_id: localStorage.getItem("user_id"),
      });
    },
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => processWebSocketMessages(event),
  });

  const getList = () => {
    sendJsonMessage({
      mode: "sidebar",
      token: localStorage.getItem("token"),
      user_type: localStorage.getItem("type"),
      user_id: localStorage.getItem("user_id"),
    });
  };

  function processWebSocketMessages(event: any) {
    let data = JSON.parse(event.data);
    if (data.mode === "latest") {
      getList();
    }

    if (data.mode === "createchat") getList();
    
    if (data.user_type == "admin" && data.mode === "sidebar") {
      setcountAdmin(data.count);
    }
    if (data.user_type == "user" && data.mode === "sidebar") {
      if (window.location.href.split("/")[3] === "chat") {
        sendJsonMessage({
          mode: "userchat",
          user_id: localStorage.getItem("user_id"),
          user_type: localStorage.getItem("type"),
          chat_id: localStorage.getItem("rooms"),
        });
      }
      setcountUser(data.count);
    }
  }

  const divStyle = {
    padding: "13px",
    backgroundColor: "red",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
  };

  // useEffect(() => {
  //   if (!localStorage.getItem("token")) {
  //     window.location.href = "/auth";
  //   }
  // }, []);

  return (
    <div className="sidenav">
      <img
        alt={"Logo"}
        style={{ borderRadius: "10px", marginInline: "10px", marginTop: 40 }}
        src={logoMain}
      />
      <MenuList
        className="Nav-menu-LIst"
        style={{ gap: "10px", overflow: "auto" }}
      >
        <MenuItem
          className={location.pathname === "/dashboard" ? "custom_active" : ""}
        >
          <Link
            to={"/dashboard"}
            state={{ title: "Dashboard" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <DashboardIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={location.pathname === "/forecast" ? "custom_active" : ""}
        >
          <Link
            to={"/forecast"}
            state={{ title: "Forecast" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <CloudQueueIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Forecast</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={location.pathname === "/overview" ? "custom_active" : ""}
        >
          <Link
            to={"/overview"}
            state={{ title: "Quick Overview" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <QuickreplyIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Quick Overview</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={location.pathname === "/weather" ? "custom_active" : ""}
        >
          <Link
            to={"/weather"}
            state={{ title: "Weather Window" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <ArtTrackIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Weather Window</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={location.pathname === "/squall" ? "custom_active" : ""}
        >
          <Link
            to={"/squall"}
            state={{ title: "squall" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <AirIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Squall</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={location.pathname === "/typhoon" ? "custom_active" : ""}
        >
          <Link
            to={"/typhoon"}
            state={{ title: "typhoon" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <StormIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Typhoon</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FlashOnIcon style={{ color: "white" }} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Lightning</ListItemText>
        </MenuItem>
        <MenuItem
          className={
            location.pathname === "/observation" ? "custom_active" : ""
          }
        >
          <Link
            to={"/observation"}
            state={{ title: "Submit Observation" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <SendIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Submit Observation</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem
          className={
            location.pathname === "/observation" ? "custom_active" : ""
          }
        >
          <Link
            to={"/map"}
            state={{ title: "map" }}
            style={{ display: "flex" }}
          >
            <ListItemIcon>
              <SendIcon style={{ color: "white" }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mapbox</ListItemText>
          </Link>
        </MenuItem>
        {localStorage.getItem("type") === "user" ? (
          <MenuItem>
            <Link
              to={"/chat"}
              state={{ title: "Submit Observation" }}
              style={{ display: "flex" }}
            >
              <ListItemIcon>
                <ConnectWithoutContactIcon
                  style={{ color: "white" }}
                  fontSize="small"
                />
              </ListItemIcon>
              <Badge
                badgeContent={countUser}
                onClick={() => setcountUser(0)}
                color="info"
              >
                <ListItemText>Contact Duty Forecaster</ListItemText>
              </Badge>
            </Link>
          </MenuItem>
        ) : (
          <MenuItem>
            <Link
              to={"/adminchat"}
              state={{ title: "Submit Observation" }}
              style={{ display: "flex" }}
            >
              <ListItemIcon>
                <ConnectWithoutContactIcon
                  style={{ color: "white" }}
                  fontSize="small"
                />
              </ListItemIcon>
              <Badge badgeContent={countAdmin} color="info">
                <ListItemText>Contact Duty Forecaster</ListItemText>
              </Badge>
            </Link>
          </MenuItem>
        )}

        {localStorage.getItem("type") === "admin" ? (
          <MenuItem>
            <Link
              to={"/usermanagement"}
              state={{ title: "Submit Observation" }}
              style={{ display: "flex" }}
            >
              <ListItemIcon>
                <SupervisorAccountIcon
                  style={{ color: "white" }}
                  fontSize="small"
                />
              </ListItemIcon>
              <ListItemText>User Management</ListItemText>
            </Link>
          </MenuItem>
        ) : null}
      </MenuList>
    </div>
  );
};

export default SideNavMenu;
