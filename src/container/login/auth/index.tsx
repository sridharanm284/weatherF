import "./styles/_index.scss";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import LoginImage from "../../../assets/vectos/sunnyblack.png";
import Logo from "../../../assets/logoMain.jpg";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Facebook, Google } from "@mui/icons-material";
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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
    event.preventDefault();
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
        localStorage.setItem("fid", data.forecast_id);
        localStorage.setItem("sideNav", "true");
        localStorage.setItem("lat", data.lat);
        localStorage.setItem("lon", data.lon);
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
              <Grid item xs={12} sm={6} sx={{ height: "100%", width: "100%" }}>
                <img
                alt="logo"
                  src={LoginImage}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
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
              <form className="login-form">
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
                <img
                  src={Logo}
                  alt="logo"
                  style={{
                    width: 150,
                    height: 100,
                    zIndex: 112,
                    borderRadius: 10,
                  }}
                />
                <div
                  style={{
                    backgroundColor: "whitesmoke",
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
                  <TextField
                    label="User Name"
                    variant="outlined"
                    className={"login-input-text"}
                    name="username"
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter the Username"
                    required
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    className={"login-input-text"}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type="password"
                    placeholder="Enter the Password"
                    required
                  />
                  <div style={{ display: "flex", flexDirection: "row" }}>
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
                <Typography variant="body2" className={"login-signup"}>
                  Don't have an account?{" "}
                  <a href="/" className={"login-signup-link"}>
                    Sign Up
                  </a>
                </Typography>
                <Typography variant="body2" className={"login-social"}>
                  or sign in with
                </Typography>
                <div className={"login-social-icons"}>
                  <Facebook className={"login-social-icon"} />
                  <Google className={"login-social-icon"} />
                </div>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}