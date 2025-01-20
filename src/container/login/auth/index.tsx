import "./styles/_index.scss";
import Alert from "@mui/material/Alert";
import OperationsComponent from "../operations/operations";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { msalConfig } from "../../../../azureAuthConfig"; 

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthPage() {
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [step, setStep] = useState<number | string | null>(
    localStorage.getItem("loginStep") ?? 1
  );
  const [password, setPassword] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem("type") === "admin" ? true : false
  );
  const [showOperations, setShowOperations] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(isAdmin, "after reload the page is showing");

  async function proceedLogin(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_IP}api/login/`,
        {
          name: name,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa("admin:admin"),
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
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
        if (data.user_type === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setStep(2);
        localStorage.setItem("loginStep", "2");
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error, "ssdsd");
    }
  }

  const handleSSOLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ["user.read"],
      });

      const account = loginResponse.account;
      localStorage.setItem("user_name", account.username);
      localStorage.setItem("login", "true");
      setStep(2);
      localStorage.setItem("loginStep", "2");
    } catch (error) {
      console.error("Azure Login Failed:", error);
      setError(true);
      setErrorMsg("SSO login failed. Please try again.");
    }
  };

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

  const closeOperations = () => {
    setShowOperations(false);
    window.location.href = "/dashboard";
  };

  return (
    <div>
      {step === 1 ? (
        <div className={"login-centre-div"}>
          <div className={"login-box"}>
            <Grid container className="login-container">
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
                      variant="filled"
                      className={"login-input-text"}
                      name="username"
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Enter the Username"
                      required
                    />
                    <TextField
                      label="Password"
                      variant="filled"
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
                        Login
                      </Button>
                    </div>
                    <Typography variant="body2" className={"login-signup"}>
                      Forgetten Password ?
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ textAlign: "center", margin: "10px 0" }}
                    >
                      --------- or ---------
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                      <Button
                        onClick={handleSSOLogin}
                        style={{ width: 200 }}
                        className={"login-submit"}
                        type="button"
                        variant="contained"
                      >
                        Sign in with SSO
                      </Button>
                    </Typography>
                  </div>
                </form>
              </Grid>
              {!isMobile && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className="login-image-container"
                ></Grid>
              )}
            </Grid>
          </div>
        </div>
      ) : step === 2 ? (
        <OperationsComponent
          isAdmin={isAdmin}
          open={showOperations}
          close={closeOperations}
        />
      ) : null}
    </div>
  );
}
