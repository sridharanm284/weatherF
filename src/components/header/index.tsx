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
import PasswordIcon from '@mui/icons-material/Password';
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
	const [passmodalOpen, setPassModalOpen] = useState(false);
	const [userModal, setUserModal] = useState<any | {}>({
		name: localStorage.getItem("user_name"),
		id: localStorage.getItem("user_id"),
		email: localStorage.getItem("email"),
		tel: localStorage.getItem("tel"),
	});
	const [passwordModal, setPasswordModal] = useState<any | {}>({
		id: localStorage.getItem("user_id"),
		password: localStorage.getItem("password"),
		old_password: localStorage.getItem("old_password"),
		c_password: localStorage.getItem("c_password"),
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
			setPassModalOpen(false);
			setsAnchorElUser(null);
			setAnchorElUser(null);
		} else if (option === "change_password") {
			setModalOpen(false);
			setPassModalOpen(true);
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
		setPassModalOpen(false);
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
				<Dialog open={modalOpen} onClose={handleClose}>
					<div
						className="header_title_settings"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: 10,
							marginBottom: 10,
							backgroundColor: "black",
							color: "yellow",
						}}
					>
						<span style={{ fontSize: '16px' }}>Profile</span>
						<button
							style={{ backgroundColor: 'transparent', outline: 'none', border: 'none', cursor: 'pointer' }}
							onClick={handleClose}
						>
							<CloseIcon fontSize="small" style={{ color: 'white', fontWeight: '600' }} />
						</button>
					</div>
					<Avatar sx={{ width: 120, height: 120 }} style={{ alignSelf: 'center' }}>
						{localStorage
							.getItem("user_name")
							?.slice(0, 1)}
					</Avatar>
					<p style={mystyle.content}>Personal Detail</p>
					<DialogContent
						style={{
							padding: "0 24px",
							display: "flex",
							flexDirection: "column",
							gap: 4,
							width: 600,
						}}
					>
						<div style={mystyle.textBox}>
							<TextField
								disabled={userEdit.name}
								autoFocus
								margin="dense"
								id="name"
								label="Name"
								type="text"
								fullWidth
								defaultValue={userDetails.name}
								onChange={(e: any) => {
									setUserModal({
										...userModal,
										name: e.target.value,
									});
								}}
								variant="outlined"
								size="small"
							/>
							<span onClick={() => setUserEdit({...userEdit, name: !userEdit.name})} style={{ alignSelf: 'end', cursor: 'pointer' }}>
								<ModeEditIcon style={{ border: '2px solid gray', padding: '6px', borderRadius: '4px' }} />
							</span>
						</div>
						<div style={mystyle.textBox}>
							<TextField
								disabled={userEdit.email}
								autoFocus
								margin="dense"
								id="email"
								label="Email Address"
								type="text"
								fullWidth
								defaultValue={userDetails.email_address}
								onChange={(e: any) => {
									setUserModal({
										...userModal,
										email: e.target.value,
									});
								}}
								variant="outlined"
								size="small"
							/>
							<span onClick={() => setUserEdit({...userEdit, email: !userEdit.email})} style={{ alignSelf: 'end', cursor: 'pointer' }}>
								<ModeEditIcon style={{ border: '2px solid gray', padding: '6px', borderRadius: '4px' }} />
							</span>
						</div>
						<div style={mystyle.textBox}>
							<TextField
								disabled={userEdit.telephone}
								autoFocus
								margin="dense"
								id="telephone"
								label="Telephone"
								type="text"
								defaultValue={userDetails.telephone}
								onChange={(e: any) => {
									setUserModal({
										...userModal,
										tel: e.target.value,
									});
								}}
								fullWidth
								variant="outlined"
								size="small"
							/>
							<span onClick={() => setUserEdit({...userEdit, telephone: !userEdit.telephone})} style={{ alignSelf: 'end', cursor: 'pointer' }}>
								<ModeEditIcon style={{ border: '2px solid gray', padding: '6px', borderRadius: '4px' }} />
							</span>
						</div>
					</DialogContent>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingInline: '20px', paddingBlock: '8px' }}>
						<div style={{ display: 'inline-flex', justifyContent: 'flex-end', gap: '10px' }}>
							<Button
								style={{
									width: "fit-content",
									gap: "10px",
									border: "1.5px solid #384e73",
								}}
								onClick={(e: any) =>
									handleOpenUserMenus(e, "change_password")
								}
							>
								<KeyIcon fontSize="small" /> Change Password
							</Button>
							<Button
								style={{
									width: "fit-content",
									gap: "10px",
									border: "1.5px solid #384e73",
								}}
								onClick={updatedata}
							>
								<UpdateIcon fontSize="small" /> Update Details
							</Button>
						</div>
					</div>
				</Dialog>
				<Dialog open={passmodalOpen} onClose={handleClose}>
					<h4
						className="header_title_settings"
						style={{
							padding: 10,
							backgroundColor: "black",
							color: "yellow",
						}}
					>
						Change Password
					</h4>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="old_pass"
							label="Old Password"
							type="text"
							fullWidth
							variant="standard"
						/>
						<TextField
							autoFocus
							margin="dense"
							id="new_pass"
							label="New Password"
							type="text"
							fullWidth
							variant="standard"
						/>
						<TextField
							autoFocus
							margin="dense"
							id="new_pass_confirm"
							label="Confirm New Password"
							type="text"
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" onClick={handleClose}>
							Update Password
						</Button>
						<Button variant="contained" onClick={handleClose}>
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
};
export default Header;