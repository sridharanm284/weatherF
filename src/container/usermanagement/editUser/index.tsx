import React, { useState, useEffect, useRef } from "react";
import store from "../../../store";
import {
  Button,
  InputLabel,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  ThemeProvider,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface ClientNamesInterface {
  client_name: string;
  client_id: string;
}

const EditUserComponent = () => {
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const data = useSelector((state: any) => state?.app);
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [clientId, setClientId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    user_type: "",
    client: "",
    operation: "",
    email_address: "",
    telephone: "",
    contract_no: "",
    region: "",
    vessel: "",
    lat: "",
    lon: "",
    site_route: "",
    start_date: "",
    end_date: "",
    expected_date: "",
    metsys_name: "",
    service_types: "",
    day_shift: "",
    night_shift: "",
    last_bill_update: "",
    wind: "",
    wave: "",
    current: "",
    satpic: "",
    client_id: "",
    forecast_id: "",
  });
  const { id } = useParams();
  const [clientNames, setClientNames] = useState<ClientNamesInterface[]>([]);
  const [operationsData, setOperationsData] = useState<any[]>([]);
  const [filesData, setFilesData] = useState({
    wind: "",
    wave: "",
    current: "",
    satpic: "",
  });
  const [selectedClientName, setSelectedClientName] = useState(false);
  const [selectedForecast_id, setSelectedForecast_id] = useState(false);
  const navigate = useNavigate();
  const clientRef = useRef<any>(null);
  const foreRef = useRef<any>(null);

  const getClientNames = async () => {
    fetch("http://localhost:8000/api/getclients/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setClientNames(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getClientNames();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/user/get/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          setFormData(data);
          setFilesData({
            wind: data.wind,
            wave: data.wave,
            current: data.current,
            satpic: data.satpic,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [id]);

  const getFiles = async (id: any) => {
    await setFilesData({ wind: "", wave: "", satpic: "", current: "" });
    fetch(`http://localhost:8000/api/getfiles/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        await setFilesData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = async () => {
    const newData = {
      ...formData,
      name: formData.name,
      password: formData.password.toString(),
      user_type: formData.user_type.toString(),
      client: formData.client.toString(),
      operation: formData.operation.toString(),
      email_address: formData.email_address.toString(),
      telephone: formData.telephone.toString(),
      contract_no:
        formData.contract_no === null ? "" : formData.contract_no.toString(),
      region: formData.region === null ? "" : formData.region.toString(),
      vessel: formData.vessel === null ? "" : formData.vessel.toString(),
      lat: formData.lat === null ? "" : formData.lat.toString(),
      lon: formData.lon === null ? "" : formData.lon.toString(),
      site_route:
        formData.site_route === null ? "" : formData.site_route.toString(),
      start_date:
        formData.start_date === null ? "" : formData.start_date.toString(),
      end_date: formData.end_date === null ? "" : formData.end_date.toString(),
      metsys_name:
        formData.metsys_name === null ? "" : formData.metsys_name.toString(),
      service_types:
        formData.service_types === null
          ? ""
          : formData.service_types.toString(),
      day_shift:
        formData.day_shift === null ? "" : formData.day_shift.toString(),
      night_shift: formData.night_shift.toString(),
      last_bill_update: formData.last_bill_update.toString(),
      wind: filesData.wind.toString(),
      wave: filesData.wave.toString(),
      current: filesData.current.toString(),
      satpic: filesData.satpic.toString(),
      client_id: formData.client_id.toString(),
    };

    fetch(`http://localhost:8000/api/user/get/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/usermanagement");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const l = localStorage.getItem("sideNav");
    setSn(l);
  }, []);

  useEffect(() => {
    store.dispatch({
      type: "TOGGLE_MENU",
      payload: windowWidth.current > 1000 ? true : false,
    });
  }, []);

  useEffect(() => {
    setOpen(data.toggle);
  }, [data]);

  const getClientData = async (a: any) => {
    await fetch(`http://localhost:8000/api/operations/${a}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOperationsData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getClientData(formData.client_id);
  }, []);

  return (
    <div
      style={
        open
          ? {
              marginLeft: 260,
              width: "calc(100% - 260px)",
              background: "transparent",
            }
          : { background: "transparent" }
      }
      className={"maina"}
    >
      <div
        style={{
          paddingBlock: "20px",
          paddingInline: "25px",
          borderRadius: "10px",
          background: "white",
        }}
        className={`content-wrap chatwrap`}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={(_: any) => navigate("/usermanagement")}
            style={{ backgroundColor: "blue", color: "white",  margin:'10px 0' }}
          >
            Back
          </Button>
        </div>
        <form>
          <Grid container spacing={2}>
            <Grid
              spacing={3}
              item
              style={{
                padding: 10,
                gap: 10,
                display: "flex",
                flexDirection: "column",
              }}
              xs={6}
            >
              <React.Fragment>
                <InputLabel>Client</InputLabel>
                {selectedClientName ? (
<Autocomplete
                   id="free-solo-demo"
                   size="small"
                   freeSolo
                   disableClearable
                   options={clientNames.map((option) => ({
                     label: option.client_name,
                     value: option.client_id.toString(),
                   }))}
                   getOptionLabel={(option: any) => option.label}
                   ref={clientRef}
                   onChange={(
                     e,
                     newValue: any | { label: string; value: string } | null
                   ) => {
                     getClientData(newValue.value);
                   }}
                   renderInput={(params) => (
<TextField
                       ref={clientRef}
                       type="search"
                       onChange={(event) => {if (event.currentTarget.value === "") {const new_obj: any = {}; Object.keys(formData).forEach(key => new_obj[key] = ""); setFormData(new_obj); const new_files_obj: any = {}; Object.keys(filesData).forEach(key => new_files_obj[key] = ""); setFilesData(new_files_obj)}}}
                       {...params}
                       label="Client Name"
                       required
                     />
                   )}
                 />
               ) : (
<input
                   required
                   value={formData.client}
                   onClick={() => {
                     setSelectedClientName(true);
                     clientRef.current && clientRef.current.focus();
                     const new_obj: any = {}; Object.keys(formData).forEach(key => new_obj[key] = ""); setFormData(new_obj); const new_files_obj: any = {}; Object.keys(filesData).forEach(key => new_files_obj[key] = ""); setFilesData(new_files_obj)
                   }}
                 />
               )}
                <InputLabel>Project Location</InputLabel>
                {selectedForecast_id ? (
                  <Autocomplete
                    id="free-solo-demoa"
                    freeSolo
                    size="small"
                    ref={foreRef}
                    disableClearable
                    options={operationsData.map((option) => ({
                      label: option.forecast_description,
                      value: option,
                    }))}
                    getOptionLabel={(option: any) => option.label}
                    onChange={(
                      event: any,
                      newValue: any | { label: string; value: string } | null
                    ) => {
                      const n = newValue.value;
                      setFormData({
                        ...formData,
                        contract_no: n?.contract_number,
                        region: n?.region_id,
                        vessel: n?.vessel_rig_platform_name,
                        lat: n?.latitude,
                        lon: n?.longitude,
                        site_route: n?.route,
                        start_date: n?.start_date,
                        forecast_id: n?.forecast_id,
                        expected_date: n?.expected_end_date,
                        operation: n?.forecast_description,
                        client_id: n?.client_id,
                      });

                      getFiles(n.forecast_id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        value={formData.operation}
                        ref={foreRef}
                        type="search"
                        {...params}
                        label="Project Location"
                      />
                    )}
                  />
                ) : (
                  <input
                    required
                    value={formData.operation}
                    onClick={() => {
                      setSelectedForecast_id(true);
                      foreRef.current && foreRef.current.focus();
                    }}
                  />
                )}
                <InputLabel htmlFor="name">username</InputLabel>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="password">Password</InputLabel>
                <input
                  name="password"
                  type="password"
                  defaultValue={formData.password}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="user_type">User Type</InputLabel>
                <Select
                  labelId="role-label"
                  id="role-select"
                  value={formData?.user_type}
                  size="small"
                  onChange={(e) => {
                    setFormData({ ...formData, user_type: e.target.value });
                  }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                <InputLabel htmlFor="email_address">Email Address</InputLabel>
                <input
                  name="email_address"
                  type="email"
                  defaultValue={formData.email_address}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="telephone">Telephone</InputLabel>
                <input
                  name="telephone"
                  type="text"
                  defaultValue={formData.telephone}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="contract_no">CTRCT NO</InputLabel>
                <input
                  name="contract_no"
                  type="text"
                  defaultValue={formData.contract_no}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="region">Region</InputLabel>
                <input
                  name="region"
                  type="text"
                  defaultValue={formData.region}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="vessel">VESSEL/RIG/PLTFRM</InputLabel>
                <input
                  name="vessel"
                  type="text"
                  defaultValue={formData.vessel}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="lat">Latitude</InputLabel>
                <input
                  name="lat"
                  defaultValue={formData.lat}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="lon">Longitude</InputLabel>
                <input
                  name="lon"
                  defaultValue={formData.lon}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="site_route">Site Route</InputLabel>
                <input
                  name="site_route"
                  defaultValue={formData.site_route}
                  onChange={handleInputChange}
                />
                <InputLabel htmlFor="start_date">Start Date</InputLabel>
                <input
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </React.Fragment>
            </Grid>
            <Grid
              spacing={3}
              item
              style={{
                padding: 10,
                gap: 10,
                display: "flex",
                flexDirection: "column",
              }}
              xs={6}
            >
              {/* <InputLabel htmlFor="end_date">End Date</InputLabel>
              <input
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleInputChange}
              /> */}
              <InputLabel htmlFor="expected_date">Expected Date</InputLabel>
              <input
                name="expected_date"
                type="datetime-local"
                defaultValue={formData.expected_date}
                onChange={handleInputChange}
              />
              <InputLabel htmlFor="metsys_name">Metsys</InputLabel>
              <input
                name="metsys_name"
                type="text"
                value={formData.metsys_name}
                onChange={handleInputChange}
              />
              <InputLabel htmlFor="service_types">Service Types</InputLabel>
              <input
                name="service_types"
                value={formData.service_types}
                onChange={handleInputChange}
              />
              <InputLabel htmlFor="day_shift">Day Shift</InputLabel>
              <input
                name="day_shift"
                value={formData.day_shift}
                onChange={handleInputChange}
              />
              <InputLabel htmlFor="night_shift">Night Shift</InputLabel>
              <input
                name="night_shift"
                value={formData.night_shift}
                onChange={handleInputChange}
              />
              <div
                style={{
                  border: "1px solid black",
                  padding: 10,
                  marginTop: 20,
                }}
              >
                <Grid>
                  <InputLabel htmlFor="wind">Wind</InputLabel>
                  <input
                    name="wind"
                    value={filesData?.wind}
                    onChange={handleInputChange}
                    style={{width:'90%'}}
                  />
                  <InputLabel htmlFor="wave">Wave</InputLabel>
                  <input
                    name="wave"
                    value={filesData?.wave}
                    onChange={handleInputChange}
                    style={{width:'90%'}}
                  />
                  <InputLabel htmlFor="current">Current</InputLabel>
                  <input
                    name="current"
                    value={filesData?.current}
                    onChange={handleInputChange}
                    style={{width:'90%'}}
                  />
                  <InputLabel htmlFor="satpic">Satpic</InputLabel>
                  <input
                    name="satpic"
                    value={filesData?.satpic}
                    onChange={handleInputChange}
                    style={{width:'90%'}}
                  />
                </Grid>
              </div>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
        <div style={{ height: "100px" }}></div>
      </div>
    </div>
  );
};

export default EditUserComponent;
