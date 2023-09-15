import { useSelector} from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IconButton, MenuItem, Box, Avatar, Menu, Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent
 } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import PasswordIcon from '@mui/icons-material/Password';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import { useState, useEffect } from "react";
import HeaderTitle from "./title";
import Switch from '@mui/material/Switch';
import store from "../../store";
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import UpdateIcon from '@mui/icons-material/Update';
import KeyIcon from '@mui/icons-material/Key';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import "./styles.scss"
import { EmailOutlined } from "@mui/icons-material";

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
			gap: '10px',
		}
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
	const [sanchorElUser, setsAnchorElUser] = useState<null | HTMLElement>(
		null
	);
	const [modalOpen, setModalOpen] = useState(false);
	const [userModal, setUserModal] = useState<any | {}>({
		name: localStorage.getItem("user_name"),
		id: localStorage.getItem("user_id"),
		email: localStorage.getItem("email"),
		tel: localStorage.getItem("tel"),
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
	}

	const handleCloseUserMenu = () => {
		setsAnchorElUser(null);
		setAnchorElUser(null);
	};
	const handleClose = () => {
		setModalOpen(false);
	};

	const updatedata = async () => {
		const res = await fetch(`http://127.0.0.1:8000/api/user/get/${localStorage.getItem('user_id')}`, {
			method: "UPDATE",
			body: JSON.stringify(userModal),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				Authorization: "Basic " + btoa("admin:admin"),
			},
		});
		if (res.status === 200) {
			localStorage.clear();
			window.location.href = "/auth";
		} else {
			window.location.reload();
		}
	};

	const updatepassword = async () => {
		/*
		const res = await fetch(`http://127.0.0.1:8000/api/user/get/${localStorage.getItem('user_id')}`, {
			method: "UPDATE",
			body: JSON.stringify(passwordModal),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				Authorization: "Basic " + btoa("admin:admin"),
			},
		});
		if (res.status === 200) {
			localStorage.clear();
			window.location.href = "/auth";
		} else {
			window.location.reload();
		}
		*/
	};

	const [themeSwitch, setThemeSwitch] = useState(localStorage.getItem('theme') === 'dark')
	const [userEdit, setUserEdit] = useState({name: true, project: true, email: true, telephone: true})
	const [userDetails, setUserDetails] = useState(Object())
	useEffect(() => {
		const getDatas = async () => {
			const response = await fetch(`http://localhost:8000/api/user/get/${localStorage.getItem('user_id')}`)
			const data = await response.json()
			localStorage.setItem('project', data.operation)
			console.log(data)
			setUserDetails(data)
		};
		getDatas()
	}, [setUserDetails, localStorage])


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
							<div
								className="flex flex-middle"
								style={{ marginRight: "2em" }}
							>
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
										<SettingsIcon style={{ color: 'white' }} />									
									</button>
									<Menu
										sx={{ mt: '32px' }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										<MenuItem style={{ display: 'flex', gap: '10px' }}
											onClick={(e:any) => handleOpenUserMenus(e, "Settings")}>
											<AccountCircleIcon />
											<Typography textAlign={"left"}>Personal Details</Typography>
										</MenuItem>
										<MenuItem style={{ display: 'flex', gap: '10px' }}>
											<DarkModeIcon />
											<Switch checked={themeSwitch} onChange={(event) => {setThemeSwitch(event.target.checked); localStorage.setItem('theme', event.target.checked ? 'dark' : 'light')}} />
										</MenuItem>
										<MenuItem style={{ display: 'flex', gap: '10px' }}
											onClick={handleLogout}>
											<LogoutIcon />
											<Typography textAlign={"left"}>Logout</Typography>
										</MenuItem>
									</Menu>
								</Box>
							</div>
						</div>
					</div>
				</div>
				<Dialog style={{ width: '100vw' }} open={modalOpen} onClose={handleClose}>
					<div className="settings_div">
						<div className="settings_profile_ico_div">
						</div>
						<div className="settings_profile_ico_details_div">
							<div className="settings_details_inner">
								<span style={{ fontSize: '22px', fontWeight: 500 }}>Personal Details</span>
								<div className="settings_input">
									<AccountCircleIcon />
									<input value={userDetails.name} onChange={(event) => setUserDetails({...userDetails, name: event.currentTarget.value})} placeholder="Name"></input>
								</div>
								<div className="settings_input">
									<EmailOutlined />
									<input value={userDetails.email_address} onChange={(event) => setUserDetails({...userDetails, email_address: event.currentTarget.value})} placeholder="Email Address"></input>
								</div>
								<div className="settings_input">
									<PhoneIcon />
									<input value={userDetails.telephone} onChange={(event) => setUserDetails({...userDetails, telephone: event.currentTarget.value})} placeholder="Telephone"></input>
								</div>
								<div className="settings_buttons">
									<button onClick={(event) => {setModalOpen(false); setsAnchorElUser(null); setAnchorElUser(null);}}>Cancel</button>
									<button onClick={updatedata} style={{ backgroundColor: '#132c3e' }}>Save</button>
								</div>
							</div>
							<div className="settings_details_inner">
								<span style={{ fontSize: '22px', fontWeight: 500 }}>Security</span>
								<div className="settings_input">
									<PasswordIcon />
									<input value={passwordModal.old_password} onChange={(event) => setPasswordModal({...passwordModal, old_password: event.currentTarget.value})} placeholder="Enter the Current Password"></input>
								</div>
								<div className="settings_input">
									<PasswordIcon />
									<input value={passwordModal.password} onChange={(event) => setPasswordModal({...passwordModal, password: event.currentTarget.value})} placeholder="Enter the New Password"></input>
								</div>
								<div className="settings_buttons">
									<button onClick={(event) => {setModalOpen(false); setsAnchorElUser(null); setAnchorElUser(null);}}>Cancel</button>
									<button onClick={updatepassword} style={{ backgroundColor: '#132c3e' }}>Update Password</button>
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