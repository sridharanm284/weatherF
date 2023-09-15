import "./styles/_index.scss";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logoMain.jpg";
import { useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
	useMediaQuery,
	useTheme,
} from "@mui/material";

export default function AuthPage() {
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();
	const theme = useTheme();

	async function proceedLogin(event: any) {
		event.preventDefault()
		try {
			setError(false);
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

	return (
		<div className={"login_main"}>
			<div className="login_header">
				<span className={"login_header_text"}> </span>
				<img src={Logo} width={110} height={75}></img>
				<span className={"login_header_text"}></span>
			</div>
			<form onSubmit={proceedLogin} className="login_form">
				<span className="login_icon_input">
					<AccountCircleIcon className="login_icon" />
					<input value={name} onChange={(event) => setName(event.currentTarget.value)} className="login_input" placeholder="Username"></input>
				</span>
				<span className="login_icon_input">
					<LockIcon className="login_icon" />
					<input value={password} type="password" onChange={(event) => setPassword(event.currentTarget.value)} className="login_input" placeholder="Password"></input>
				</span>
				{error &&
					<span style={{ borderRadius: "18px" }} className={["login_icon_input", 'error_box'].join(' ')}>
						{errorMsg}
					</span>
				}
				<button type="submit" className={["login_icon_input", "submit_button"].join(' ')}>
					Login
				</button>
			</form>
		</div>
	);
}