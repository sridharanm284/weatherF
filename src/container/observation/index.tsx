import "./styles/_index.scss";
import store from "../../store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import { styled } from "@mui/material/styles";
import SideNavMenu from "../../routers/sideNav";
import { useState, useRef, useEffect } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import successIcon from './../../assets/vectos/icons8-tick.gif';




// space between Navigation and Table Content
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
  const [rendered, setRendered] = useState(false)
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
      placeholder: "m"
    },
    {
      name: "Swell HT",
      type: "text",
      id: "swell1height",
      placeholder: "m" },
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
      placeholder: ""
    },
    {
      name: "Present Weather",
      type: "text",
      id: "present",
      placeholder: ""
    },
  ]);

  // Reference value for current Browser Window Width
  const windowWidth = useRef(window.innerWidth);
  const popup = useRef<HTMLDivElement>(null);
 

  // Sets Track about the SideNav Bar Open/Close State
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const data = useSelector((state: any) => state?.app);
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
    fetch(`http://localhost:8000/api/getplaceholder/${localStorage.getItem('fid')}`)
      .then((response) => response.json())
      .then((response_data) => {
        const fields_inner: any = []
        fields.map((data: any) => {
          try {
            data.placeholder = response_data[data.id].output_unit_name
          } catch {}
          fields_inner.push(data)
        })
        setFields(fields_inner)
      })
      setRendered(true)
  })

  function formSubmission(event: any) {
    event.preventDefault();
    const elements = event.currentTarget.elements;
    fetch("http://127.0.0.1:8000/api/observation/", {
      method: "POST",
      body: JSON.stringify({
        date_time: elements.date_time.value,
        wind_direction:elements.a_10mwinddir.value,
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
        return response.json();
      })
      .catch((error) => {
        console.log("Cannot Submit the Form");
      });
    for (const element in elements) {
      try {
        elements[element].value = "";
      } catch (e) {}
    }
    const popupdiv = popup.current;
    if (popupdiv) {
      popupdiv.style.display = "block";
    }
  }

  function disablePopup() {
    const popupdiv = popup.current;
    if (popupdiv) {
      popupdiv.style.display = "none";
    }
  }

  return (
      <div className={open ? "sideNavOpen" : "sideNavClose"}>
        
        <Box className="ailevate-container bg-default flex sidenav-full">
          <div className="content-wrap dashboard">
           
            <Main open={open} className={"observation-main"}>
              <form
                onSubmit={formSubmission}
                className={"observation-container"}
              >
                <div className={"observation-container-inner"}>
                  {fields.map((field, index: number) => (
                    <Stack
                      key={index}
                      className={"observation-container-options"}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                    >
                      <span className={"field-name"}>{field.name}</span>
                      <input
                        className={"field-input"}
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                      />
                    </Stack>
                  ))}
                </div>
                <div className={"container-buttons"}>
                  <button style={{ backgroundColor: "#2961bf" }} type="submit">
                    Send
                  </button>
                </div>
              </form>
              <div ref={popup} className={"popup"}>
  <div className={"popup-div"}>
    <div className={"popup-content"}>
      <div className="animated-content">
        <div className="success-icon">
        <img src={successIcon} alt="Success Icon" />
        </div>
        <span>Observation Form Submitted</span>
      </div>
      <button onClick={disablePopup}>Close</button>
    </div>
  </div>
</div>

            </Main>
          </div>
        </Box>
      </div>
  );
}