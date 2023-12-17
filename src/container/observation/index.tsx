import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { useState, useRef, useEffect } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import successIcon from "../../assets/vectos/icons8-tick.gif";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
const drawerWidth = 0;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: '10px 10px 10px 10px',
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
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

export default function Observation() {
  const [fields, setFields] = useState([
    {
      name: "Date / Time",
      type: "datetime-local",
      id: "date_time",
      placeholder: "",
    },
    {
      name: "Wind Direction",
      type: "text",
      id: "a_10mwinddir",
      placeholder: "",
    },
    {
      name: "Wind Speed",
      type: "text",
      id: "a_10mwindspeed",
      placeholder: "knots",
    },
    {
      name: "Combined SIG Wave HT",
      type: "text",
      id: "sigwaveheight",
      placeholder: "m",
    },
    {
      name: "Swell HT",
      type: "text",
      id: "swell1height",
      placeholder: "m",
    },
    {
      name: "Swell Period",
      type: "text",
      id: "swell1period",
      placeholder: "s",
    },
    {
      name: "Swell Direction",
      type: "text",
      id: "swell1direction",
      placeholder: "",
    },
    {
      name: "VIS",
      type: "text",
      id: "vis",
      placeholder: "[km]",
    },
    {
      name: "Present Weather",
      type: "text",
      id: "present",
      placeholder: "",
    },
  ]);

  const windowWidth = useRef(window.innerWidth);
  const popup = useRef<HTMLDivElement>(null);
  const failurePopup = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);
  const [rendered, setRendered] = useState(false);

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
    if (rendered) return;
    fetch(
      `http://localhost:8000/api/getplaceholder/${localStorage.getItem("fid")}`
    )
      .then((response) => response.json())
      .then((response_data) => {
        const fields_inner: any = [];
        fields.map((data: any) => {
          try {
            data.placeholder = response_data[data.id].output_unit_name;
          } catch {}
          fields_inner.push(data);
        });
        setFields(fields_inner);
      });
    setRendered(true);
  }, [fields, rendered]);
  

  function formSubmission(event: any) {
    event.preventDefault();
    const elements = event.currentTarget.elements;
  
    const popupdiv = popup.current;
    const failurePopupDiv = failurePopup.current;
  
    fetch("http://127.0.0.1:8000/api/observation/", {
      method: "POST",
      body: JSON.stringify({
        date_time: elements.date_time.value,
        wind_direction: elements.a_10mwinddir.value,
        wind_speed: elements.a_10mwindspeed.value,
        combined: elements.sigwaveheight.value,
        swell_ht: elements.swell1height.value,
        swell_period: elements.swell1period.value,
        swell_direction: elements.swell1direction.value,
        vis: elements.vis.value,
        present: elements.present.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((response) => {
        if (response.ok) {
          // Show success popup immediately
          if (popupdiv) {
            popupdiv.style.display = "block";
          }
        } else {
          // Show failure popup immediately
          if (failurePopupDiv) {
            failurePopupDiv.style.display = "block";
            setTimeout(() => {
              disableFailurePopup();
            }, 2000); // Add a delay before hiding the failure popup if needed
          }
        }
        return response.json();
      })
      .catch((error) => {
        console.log("Cannot Submit the Form");
      })
      .finally(() => {
        // Hide success popup after 2 seconds (adjust the delay as needed)
        if (popupdiv) {
          setTimeout(() => {
            disablePopup();
          }, 2000);
        }
  
        for (const element in elements) {
          try {
            elements[element].value = "";
          } catch (e) {}
        }
      });
  }
  

  function disablePopup() {
    const popupdiv = popup.current;
    if (popupdiv) {
      popupdiv.style.display = "none";
    }
  }

  function disableFailurePopup() {
    const failurePopupDiv = failurePopup.current;
    if (failurePopupDiv) {
      failurePopupDiv.style.display = "none";
    }
  }

  return (
    <div className={open ? "sideNavOpen" : "sideNavClose"}>
      <Box className="fug-container bg-default flex sidenav-full">
        <div className="content-wrap dashboard">
          <Main open={open} className="observation-main">
            <form onSubmit={formSubmission} className="observation-container">
              <div className="observation-container-inner">
                {fields.map((field, index) => (
                  <Stack
                    key={index}
                    className="observation-container-options"
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                  >
                    <span className="field-name">{field.name}</span>
                    <Input
                      className="field-input"
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      fullWidth
                     // variant="outlined"
                    />
                  </Stack>
                ))}
              </div>
              <div className="container-buttons">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2961bf" }}
                  type="submit"
                >
                  Send
                </Button>
              </div>
            </form>
            <div ref={popup} className="popup">
              <div className="popup-div">
                <div className="popup-content">
                  <div className="animated-content">
                    <div className="success-icon">
                      <img src={successIcon} alt="Success Icon" />
                    </div>
                    <span>Observation Form Submitted</span>
                  </div>
                  <Button onClick={disablePopup}>Close</Button>
                </div>
              </div>
            </div>
            <div ref={failurePopup} className="popup failure-popup">
              <div className="popup-div">
                <div className="popup-content">
                  <div className="animated-content">
                    <div className="failure-icon">
                      {/* <img src={failureIcon} alt="Failure Icon" /> */}
                    </div>
                    <span>Failed to Submit Observation Form</span>
                  </div>
                  <Button onClick={disableFailurePopup}>Close</Button>
                </div>
              </div>
            </div>
          </Main>
        </div>
      </Box>
    </div>
  );
}


