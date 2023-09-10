import "./styles/_index.scss";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import LoginImage from "../../../assets/vectos/login.webp";
import Logo from "../../../assets/logoMain.jpg";
import Sunny from "../../../assets/vectos/sunny.png";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import OperationsComponent from "../operations/operations";
import {
	Button,
	Grid,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";

export default function AuthPage() {
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showOperations, setShowOperations] = useState(true);
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	async function proceedLogin(event: React.MouseEvent<HTMLButtonElement>) {
		try {
			const res = await fetch("http://127.0.0.1:8000/api/login/", {
				method: "POST",
				body: JSON.stringify({
					name: name,
					password: password,
				}),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					Authorization: "Basic " + btoa("admin:admin"),
				},
			});

			if (res.status === 200) {
				const data = await res.json();
				localStorage.setItem("user_id", data.user_id);
				localStorage.setItem("login", "true");
				localStorage.setItem("token", data.token);
				localStorage.setItem("user_name", data.user);
				localStorage.setItem("type", data.user_type);
				localStorage.setItem("client_id", data.client_id);
				localStorage.setItem("lat", data.lat);
				localStorage.setItem("lon", data.lon);
				localStorage.setItem("fid", data.forecast_id);
				localStorage.setItem("email", data.other.email_address);
				localStorage.setItem("tel", data.other.telephone);
				localStorage.setItem("sideNav", "true");
				window.location.href = "/dashboard";
			} else {
				setError(true);
				const data = await res.json();
				setErrorMsg(data.data);
				console.log(res, "ddf");
			}
		} catch (error) {
			console.error(error, "ssdsd");
		}
	}

	useEffect(() => {
		if (error) {
			const timeout = setTimeout(() => {
				setError(false);
			}, 5000);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [error]);

	return (
		<div>
			<div className={"login-centre-div"}>
				<div className={"login-box"}>
					<Grid container className="login-container">
						{!isMobile && (
							<Grid
								item
								xs={6}
								sm={6}
							>
								<div className="login_leftCode">
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "flex-start",
											padding:10
										}}
									>
										<div className="date">
											Today,{" "}
											{new Date().toString().slice(0, 10)}
										</div>
										<div className="city">Singapore</div>
										<div className="body">
											<img src={Sunny} alt="dd" />
											<div className="content">
												<div className="text_title">Current Weather</div>
												<div className="text_des">8:00 PM</div>
												<div className="text_head">25<sup>o</sup></div>
											</div>
										</div>
									</div>
								</div>
							</Grid>
						)}
						<Grid
							item
							xs={12}
							sm={6}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div className="login-form">
								{error && (
									<Alert
										style={{
											width: "90%",
											alignItems: "center",
										}}
										severity="error"
									>
										{errorMsg}
									</Alert>
								)}
							{/*	<img
									src={Logo}
									alt="logo"
									style={{
										width: 150,
										height: 100,
										zIndex: 112,
										borderRadius: 10,
									}}
								/>*/}
								<div
									style={{
										padding: 30,
										paddingTop: 60,
										marginTop: -50,
										borderRadius: 10,
										display: "flex",
										alignItems: "center",
										flexDirection: "column",
										gap: 20,
										width: isMobile ? "100%" : "70%",
									}}
								>
								<div className="title">Sign In</div>
									<TextField
										label="User Name"
										variant="outlined"
										className={"login-input-text"}
										name="username"
										onChange={(e) =>
											setName(e.target.value)
										}
										type="text"
										placeholder="Enter the Username"
										required
									/>
									<TextField
										label="Password"
										variant="outlined"
										className={"login-input-text"}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										name="password"
										type="password"
										placeholder="Enter the Password"
										required
									/>
									<div
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<Button
											onClick={proceedLogin}
											style={{ width: 150 }}
											className={"login-submit"}
											type="submit"
											variant="contained"
										>
											SIGN IN
										</Button>
									</div>
								</div>
								<Typography
									variant="body2"
									className={"login-signup"}
								>
									Don't have an account?{" "}
									<a href="/" className={"login-signup-link"}>
										Sign Up
									</a>
								</Typography>
								{/*<Typography
									variant="body2"
									className={"login-social"}
								>
									or sign in with
								</Typography>
								<div className={"login-social-icons"}>
									<Facebook className={"login-social-icon"} />
									<Google className={"login-social-icon"} />
								</div>*/}
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
}