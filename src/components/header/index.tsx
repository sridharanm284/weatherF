import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconButton,
  MenuItem,
  Box,
  Menu,
  Typography,
  Dialog,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useState, useEffect, useRef } from "react";
import Switch from "@mui/material/Switch";
import store from "../../store";
import LogoutIcon from "@mui/icons-material/Logout";
import UpdateIcon from "@mui/icons-material/Update";
import LockIcon from "@mui/icons-material/Lock";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";
import "./style.scss";
import { EmailOutlined } from "@mui/icons-material";
import Alert from "@mui/material/Alert";
import axios from "axios";

const Header = (props: any) => {
  const mystyle = {
    arrowIcon: {
      color: "white",
    },
    header: {
      backgroundColor: "black",
      padding: "10px 20px",
      color: "white",
    },
    content: {
      padding: "0 20px",
    },
    textBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
  };
  const location = useLocation();
  const navigate = useNavigate();
  const data = useSelector((state: any) => state?.app);
  const handleToggle = () => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: data.toggle ? false : true,
    });
  };
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [sanchorElUser, setsAnchorElUser] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateIcon, setUpdateIcon] = useState(null);
  //const [updateText, setUpdateText] = useState("");
  const [updateStatus, setUpdateStatus] = useState<any>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [userModal, setUserModal] = useState<any | {}>({
    name: localStorage.getItem("user_name"),
    id: localStorage.getItem("user_id"),
    email: localStorage.getItem("email_address"),
    tel: localStorage.getItem("telephone"),
  });
  const [passwordModal, setPasswordModal] = useState<any | {}>({
    id: localStorage.getItem("user_id"),
    old_password: "",
    password: "",
  });
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenUserMenus = (
    event: React.MouseEvent<HTMLElement>,
    option: any
  ) => {
    if (option === "Settings") {
      setModalOpen(true);
      setsAnchorElUser(null);
      setAnchorElUser(null);
    } else if (option === "Theme") {
      setsAnchorElUser(event.currentTarget);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.setItem("sideNav", "true");
    window.location.href = "/auth";
  };
  const handleCloseUserMenu = () => {
    setsAnchorElUser(null);
    setAnchorElUser(null);
  };
  const handleClose = () => {
    setModalOpen(false);
    setUpdateStatus(null);
  };
  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_IP}api/user/get/${localStorage.getItem("user_id")}`
        );
        const data = response.data;
        localStorage.setItem("email_address", data.email_address);
        localStorage.setItem("telephone", data.telephone);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getDatas();
  }, []);

  const updatedata = async () => {
    if (
      userModal.name === " " ||
      userModal.name === "" ||
      userModal.name === null
    ) {
      const message: any = (
        <Alert severity="warning">Name field is required</Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      return;
    }
    if (
      userModal.email === " " ||
      userModal.email === "" ||
      userModal.email === null
    ) {
      const message: any = (
        <Alert severity="warning">Email field is required</Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      return;
    }
    if (
      userModal.tel === " " ||
      userModal.tel === "" ||
      userModal.tel === null
    ) {
      const message: any = (
        <Alert severity="warning">Telephone field is required</Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      return;
    }
   
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_IP}api/user/update/${localStorage.getItem(
                "user_id"
              )}`,
      userModal,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: 'Basic ' + btoa('admin:admin'),
        },
      }
    );
    if (res.status === 200) {
      const message: any = (
        <Alert severity="success">Successfully updated.</Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
    } else {
      <Alert severity="error">Something went wrong.</Alert>;
    }
  };
  const updatepassword = async () => {
    if (
      passwordModal.old_password === " " ||
      passwordModal.old_password === "" ||
      passwordModal.old_password === null
    ) {
      const message: any = (
        <Alert severity="warning"> Currect password field is required. </Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      return;
    }
    if (
      passwordModal.password === " " ||
      passwordModal.password === "" ||
      passwordModal.password === null
    ) {
      const popupdiv = popup.current;
      const message: any = (
        <Alert severity="warning"> New password field is required. </Alert>
      );
      setUpdateIcon(message);
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      return;
    }
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_IP}api/user/update/${localStorage.getItem(
                "user_id"
              )}`,
    passwordModal,
    {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    }
   );
    
    if (res.status === 200) {
      const message: any = (
        <Alert severity="success"> Successfully updated </Alert>
      );
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/auth";
      }, 2000);
    } else if (res.status === 401) {
      const message: any = <Alert severity="error"> Invalid Password. </Alert>;
      setUpdateIcon(message);
      const popupdiv = popup.current;
      if (popupdiv) {
        popupdiv.style.display = "block";
      }
      const popupdivNew = popup.current;
      setTimeout(() => {
        if (popupdivNew) popupdivNew.style.display = "none";
      }, 1000);
    } else {
      window.location.reload();
    }
  };
  const [themeSwitch, setThemeSwitch] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [userEdit, setUserEdit] = useState({
    name: true,
    project: true,
    email: true,
    telephone: true,
  });
  const [userDetails, setUserDetails] = useState(Object());

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_IP}api/user/get/${localStorage.getItem("user_id")}`
        );
        const data = response.data;
        localStorage.setItem("project", data.operation);
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getDatas();
  }, [setUserDetails]);

  function disablePopup() {
    const popupdiv = popup.current;
    if (popupdiv) {
      popupdiv.style.display = "none";
    }
  }
  return (
    <>
      <div className={props.className}>
        <div className="topbar">
          <div className="topbar-hold fixed">
            <div className="flex flex-space-between flex-middle h-100">
              <div className="flex">
                <IconButton onClick={handleToggle}>
                  <MenuIcon style={{ color: "white" }} />
                </IconButton>
              </div>
              <div className="flex flex-middle" style={{ marginRight: "2em" }}>
                <Box
                  sx={{ flexGrow: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "0px",
                  }}
                >
                  <button
                    onClick={(e) => handleOpenUserMenu(e)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <SettingsIcon style={{ color: "white" }} />
                  </button>
                  <Menu
                    sx={{ mt: "32px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      style={{ display: "flex", gap: "10px" }}
                      onClick={(e: any) => handleOpenUserMenus(e, "Settings")}
                    >
                      <AccountCircleIcon />
                      <Typography textAlign={"left"}>
                        Personal Details
                      </Typography>
                    </MenuItem>
                    <MenuItem style={{ display: "flex", gap: "10px" }}>
                      <DarkModeIcon />
                      <Switch
                        checked={themeSwitch}
                        onChange={(event) => {
                          setThemeSwitch(event.target.checked);
                          localStorage.setItem(
                            "theme",
                            event.target.checked ? "dark" : "light"
                          );
                        }}
                      />
                    </MenuItem>
                    <MenuItem
                      style={{ display: "flex", gap: "10px" }}
                      onClick={handleLogout}
                    >
                      <LogoutIcon />
                      <Typography textAlign={"left"}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          style={{ width: "100vw" }}
          open={modalOpen}
          onClose={handleClose}
        >
          <div className="settings_div">
            <div className="settings_profile_ico_details_div">
              <div className="settings_details_inner">
                <span style={{ fontSize: "22px", fontWeight: 500 }}>
                  Personal Details
                </span>
                <div className="settings_input">
                  <AccountCircleIcon />
                  <input
                    value={userModal.name}
                    onChange={(event) =>
                      setUserModal({
                        ...userModal,
                        name: event.currentTarget.value,
                      })
                    }
                    placeholder="Name"
                  ></input>
                </div>
                <div className="settings_input">
                  <EmailOutlined />
                  <input
                    value={userModal.email}
                    onChange={(event) =>
                      setUserModal({
                        ...userModal,
                        email: event.currentTarget.value,
                      })
                    }
                    placeholder="Email Address"
                  ></input>
                </div>
                <div className="settings_input">
                  <PhoneIcon />
                  <input
                    value={userModal.tel}
                    onChange={(event) =>
                      setUserModal({
                        ...userModal,
                        tel: event.currentTarget.value,
                      })
                    }
                    placeholder="Telephone"
                  ></input>
                </div>
                <div className="settings_buttons">
                  <button
                    onClick={(event) => {
                      setModalOpen(false);
                      setsAnchorElUser(null);
                      setAnchorElUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updatedata}
                    style={{ backgroundColor: "#132c3e" }}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="settings_details_inner">
                <span style={{ fontSize: "22px", fontWeight: 500 }}>
                  Security
                </span>
                <div className="settings_input">
                  <LockIcon />
                  <input
                    value={passwordModal.old_password}
                    onChange={(event) =>
                      setPasswordModal({
                        ...passwordModal,
                        old_password: event.currentTarget.value,
                      })
                    }
                    placeholder="Enter the Current Password"
                  ></input>
                </div>
                <div className="settings_input">
                  <LockIcon />
                  <input
                    value={passwordModal.password}
                    onChange={(event) =>
                      setPasswordModal({
                        ...passwordModal,
                        password: event.currentTarget.value,
                      })
                    }
                    placeholder="Enter the New Password"
                  ></input>
                </div>
                <div className="settings_buttons">
                  <button
                    onClick={(event) => {
                      setModalOpen(false);
                      setsAnchorElUser(null);
                      setAnchorElUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updatepassword}
                    style={{ backgroundColor: "#132c3e" }}
                  >
                    Update Password
                  </button>
                </div>
              </div>
              {updateStatus !== null ? (
                <div style={{ width: "100%" }}>
                  <h4
                    style={{
                      background: `${
                        updateStatus !== "Invalid Password" ||
                        updateStatus !== "Something went wrong"
                          ? "green"
                          : "red"
                      }`,
                      color: "white",
                      padding: "10px",
                      marginLeft: "20px",
                      textAlign: "center",
                      marginRight: "20px",
                      borderRadius: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    {updateStatus}
                  </h4>
                </div>
              ) : null}
            </div>
          </div>
          <div ref={popup} className="popup">
            <div className="popup-div">
              <div
                className="popup-content"
                style={{ background: "transparent", border: "0" }}
              >
                <div>
                  <div className="success-icon">{updateIcon}</div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default Header;
