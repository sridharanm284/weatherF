import React, { useState, useEffect, useRef } from "react";
import "./_index.scss";
import store from "../../../store";
import {
  Button,
  InputLabel,
  Grid,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userImg from "../../../assets/icons8-arrow-24.png";
import axios from "axios";

interface ClientNamesInterface {
  client_name: string;
  client_id: string;
}
const AddNewUserComponent = () => {
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const data = useSelector((state: any) => state?.app);
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const [clientId, setClientId] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");
  const popup = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  const [userId, setUserId] = useState("");
  const clientRef = useRef<any>(null);
  const [clientNames, setClientNames] = useState<ClientNamesInterface[]>([]);
  const [operationsData, setOperationsData] = useState<any[]>([]);
  const [filesData, setFilesData] = useState({
    wind: "",
    wave: "",
    current: "",
    satpic: "",
  });
  const projectNo = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const getClientNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_IP}api/getclients/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setClientNames(data);
    } catch (error) {
      console.error("Error fetching client names:", error);
    }
  };
  useEffect(() => {
    getClientNames();
  }, []);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const getFiles = async (id: any) => {
    await setFilesData({ wind: "", wave: "", satpic: "", current: "" });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_IP}api/getfiles/${id}/`
      );
      const data = response.data;
      await setFilesData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    const newData = {
      ...formData,
      password: formData.password.toString(),
      user_type: formData.user_type.toString(),
      client: formData.client.toString(),
      operation: formData.operation.toString(),
      email_address: formData.email_address.toString(),
      telephone: formData.telephone.toString(),
      contract_no: formData.contract_no?.toString() || "",
      region: formData.region?.toString() || "",
      vessel: formData.vessel?.toString() || "",
      lat: formData.lat?.toString() || "",
      lon: formData.lon?.toString() || "",
      site_route: formData.site_route?.toString() || "",
      start_date: formData.start_date?.toString() || "",
      end_date: formData.end_date?.toString() || "",
      metsys_name: formData.metsys_name?.toString() || "",
      service_types: formData.service_types?.toString() || "",
      day_shift: formData.day_shift?.toString() || "",
      night_shift: formData.night_shift.toString(),
      last_bill_update: formData.last_bill_update.toString(),
      wind: filesData.wind.toString(),
      wave: filesData.wave.toString(),
      current: filesData.current.toString(),
      satpic: filesData.satpic.toString(),
      forecast_id: formData.forecast_id.toString(),
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_IP}api/user/save/`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "username already exists") {
        const popupdiv = popup.current;
        if (popupdiv) {
          popupdiv.style.display = "block";
        }
      } else {
        navigate("/usermanagement");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
  useEffect(() => {
    if (selectedClientName !== "") {
      setFormData({
        ...formData,
        operation: "",
      });
    }
  }, [selectedClientName]);

  const getClientData = async (a: any) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_IP}api/operations/${a}/`
      );
      const data = response.data;
      setOperationsData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function disablePopup() {
    const popupdiv = popup.current;
    if (popupdiv) {
      popupdiv.style.display = "none";
    }
  }
  return (
    <div
      style={{
        marginLeft: open ? 260 : 0,
        transition: "margin-left 0.3s ease-in-out",
        //background: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={"maina"}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          background: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "60%",
          maxWidth: "800px",
        }}
        className={`content-wrap chatwrap`}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={(_: any) => navigate("/usermanagement")}
            style={{
              backgroundColor: "blue",
              color: "white",
              margin: "10px 0",
            }}
          >
            Back
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid
              spacing={3}
              item
              data-aos="fade-up"
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
                {selectedClientName === "" ? (
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    autoHighlight
                    size="small"
                    ref={clientRef}
                    options={clientNames.map((option) => ({
                      label: option.client_name,
                      value: option.client_id.toString(),
                    }))}
                    getOptionLabel={(option: any) =>
                      option ? option.label : ""
                    }
                    onChange={(
                      event: any,
                      newValue: any | { label: string; value: string } | null
                    ) => {
                      if (newValue) {
                        setSelectedClientName(newValue.label);
                        getClientData(newValue.value);
                        setFormData({
                          name: "",
                          password: "",
                          user_type: "",
                          client: newValue.label,
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
                          client_id: newValue.value,
                          forecast_id: "",
                        });
                        setFilesData({
                          wind: "",
                          wave: "",
                          current: "",
                          satpic: "",
                        });
                      } else {
                        setSelectedClientName("");
                        setFormData({
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
                        setFilesData({
                          wind: "",
                          wave: "",
                          current: "",
                          satpic: "",
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        style={{ width: "20vw" }}
                        required
                        onClick={() => {
                          setSelectedClientName("");
                          clientRef.current && clientRef.current.focus();
                          const new_obj: any = {};
                          Object.keys(formData).forEach(
                            (key) => (new_obj[key] = "")
                          );
                          setFormData(new_obj);
                          const new_files_obj: any = {};
                          Object.keys(filesData).forEach(
                            (key) => (new_files_obj[key] = "")
                          );
                          setFilesData(new_files_obj);
                        }}
                        type="search"
                        {...params}
                        label="Client Name"
                      />
                    )}
                  />
                ) : (
                  <input
                    required
                    value={formData.client}
                    onClick={() => {
                      setSelectedClientName("");
                      clientRef.current && clientRef.current.focus();
                      const new_obj: any = {};
                      Object.keys(formData).forEach(
                        (key) => (new_obj[key] = "")
                      );
                      setFormData(new_obj);
                      const new_files_obj: any = {};
                      Object.keys(filesData).forEach(
                        (key) => (new_files_obj[key] = "")
                      );
                      setFilesData(new_files_obj);
                    }}
                  />
                )}
                {selectedClientName && (
                  <>
                    <InputLabel>Project No</InputLabel>
                    <Autocomplete
                      id="free-solo-demoa"
                      size="small"
                      disableClearable
                      freeSolo
                      autoHighlight
                      options={operationsData.map((option) => ({
                        label: option.forecast_description,
                        value: option,
                      }))}
                      defaultValue={{
                        label: formData.operation,
                        value: operationsData,
                      }}
                      getOptionLabel={(option: any) =>
                        option ? option.label : ""
                      }
                      onInputChange={(event, newInputValue) => {
                        if (!newInputValue.trim()) {
                          const newFormData = {
                            ...formData,
                            contract_no: "",
                            region: "",
                            vessel: "",
                            lat: "",
                            lon: "",
                            site_route: "",
                            start_date: "",
                            end_date: "",
                            expected_date: "",
                            operation: "",
                            client_id: "",
                          };
                          setFormData(newFormData);
                          setFilesData({
                            wind: "",
                            wave: "",
                            current: "",
                            satpic: "",
                          });
                        }
                      }}
                      onChange={(
                        event: any,
                        newValue: any | { label: string; value: string } | null
                      ) => {
                        if (newValue) {
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
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          type="search"
                          ref={projectNo}
                          {...params}
                          value={formData.operation}
                          label="Project No"
                          style={{ width: "20vw" }}
                          required
                        />
                      )}
                    />
                  </>
                )}
                <InputLabel
                  className={
                    isSubmitted && formData.name === "" ? "input-error" : ""
                  }
                  htmlFor="name"
                >
                  Name
                </InputLabel>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.password === "" ? "input-error" : ""
                  }
                  htmlFor="password"
                >
                  Password
                </InputLabel>
                <input
                  name="password"
                  type="password"
                  defaultValue={formData.password}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.user_type === ""
                      ? "input-error"
                      : ""
                  }
                  htmlFor="user_type"
                >
                  User Type
                </InputLabel>
                <Select
                  style={{ width: "20vw" }}
                  labelId="role-label"
                  id="role-select"
                  defaultValue={formData?.user_type}
                  size="small"
                  onChange={(e) => {
                    setFormData({ ...formData, user_type: e.target.value });
                  }}
                >
                  <MenuItem style={{ width: "20vw" }} value="user">
                    User
                  </MenuItem>
                  <MenuItem style={{ width: "20vw" }} value="admin">
                    Admin
                  </MenuItem>
                </Select>
                <InputLabel
                  className={
                    isSubmitted && formData.email_address === ""
                      ? "input-error"
                      : ""
                  }
                  htmlFor="email_address"
                >
                  Email Address
                </InputLabel>
                <input
                  name="email_address"
                  type="email"
                  defaultValue={formData.email_address}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.telephone === ""
                      ? "input-error"
                      : ""
                  }
                  htmlFor="telephone"
                >
                  Telephone
                </InputLabel>
                <input
                  name="telephone"
                  type="text"
                  defaultValue={formData.telephone}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.contract_no === ""
                      ? "input-error"
                      : ""
                  }
                  htmlFor="contract_no"
                >
                  CTRCT NO
                </InputLabel>
                <input
                  name="contract_no"
                  type="text"
                  defaultValue={formData.contract_no}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.region === "" ? "input-error" : ""
                  }
                  htmlFor="region"
                >
                  Region
                </InputLabel>
                <input
                  name="region"
                  type="text"
                  defaultValue={formData.region}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.vessel === "" ? "input-error" : ""
                  }
                  htmlFor="vessel"
                >
                  VESSEL/RIG/PLTFRM
                </InputLabel>
                <input
                  name="vessel"
                  type="text"
                  defaultValue={formData.vessel}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.lat === "" ? "input-error" : ""
                  }
                  htmlFor="lat"
                >
                  Latitude
                </InputLabel>
                <input
                  name="lat"
                  defaultValue={formData.lat}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.lon === "" ? "input-error" : ""
                  }
                  htmlFor="lon"
                >
                  Longitude
                </InputLabel>
                <input
                  name="lon"
                  defaultValue={formData.lon}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.site_route === ""
                      ? "input-error"
                      : ""
                  }
                  htmlFor="site_route"
                >
                  Site Route
                </InputLabel>
                <input
                  name="site_route"
                  defaultValue={formData.site_route}
                  onChange={handleInputChange}
                />
                <InputLabel
                  className={
                    isSubmitted && formData.start_date === "" && null
                      ? "input-error"
                      : ""
                  }
                  htmlFor="start_date"
                >
                  Start Date
                </InputLabel>
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
              <InputLabel
                className={
                  isSubmitted && formData.expected_date === ""
                    ? "input-error"
                    : ""
                }
                htmlFor="expected_date"
              >
                Expected Date
              </InputLabel>
              <input
                name="expected_date"
                type="datetime-local"
                defaultValue={formData.expected_date}
                onChange={handleInputChange}
              />
              <InputLabel
                className={
                  isSubmitted && formData.metsys_name === ""
                    ? "input-error"
                    : ""
                }
                htmlFor="metsys_name"
              >
                Metsys Name
              </InputLabel>
              <input
                name="metsys_name"
                type="text"
                value={formData.metsys_name}
                onChange={handleInputChange}
              />
              <InputLabel
                className={
                  isSubmitted && formData.service_types === ""
                    ? "input-error"
                    : ""
                }
                htmlFor="service_types"
              >
                Service Types
              </InputLabel>
              <input
                name="service_types"
                value={formData.service_types}
                onChange={handleInputChange}
              />
              <InputLabel
                className={
                  isSubmitted && formData.day_shift === "" ? "input-error" : ""
                }
                htmlFor="day_shift"
              >
                Day Shift
              </InputLabel>
              <input
                name="day_shift"
                value={formData.day_shift}
                onChange={handleInputChange}
              />
              <InputLabel
                className={
                  isSubmitted && formData.night_shift === ""
                    ? "input-error"
                    : ""
                }
                htmlFor="night_shift"
              >
                Night Shift
              </InputLabel>
              <input
                name="night_shift"
                value={formData.night_shift}
                onChange={handleInputChange}
              />
              <Grid>
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "0vw",
                    padding: 10,
                    marginTop: 20,
                    width: "90%",
                    maxWidth: "30em",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxSizing: "border-box",
                  }}
                >
                  <InputLabel
                    className={
                      isSubmitted && formData.wind !== "" ? "input-error" : ""
                    }
                    htmlFor="wind"
                  >
                    Wind
                  </InputLabel>
                  <input
                    name="wind"
                    value={filesData?.wind}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                  <InputLabel
                    className={
                      isSubmitted && formData.wave !== "" ? "input-error" : ""
                    }
                    htmlFor="wave"
                  >
                    Wave
                  </InputLabel>
                  <input
                    name="wave"
                    value={filesData?.wave}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                  <InputLabel
                    className={
                      isSubmitted && formData.current !== ""
                        ? "input-error"
                        : ""
                    }
                    htmlFor="current"
                  >
                    Current
                  </InputLabel>
                  <input
                    name="current"
                    value={filesData?.current}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                  <InputLabel
                    className={
                      isSubmitted && formData.satpic !== "" ? "input-error" : ""
                    }
                    htmlFor="satpic"
                  >
                    Satpic
                  </InputLabel>
                  <input
                    name="satpic"
                    value={filesData?.satpic}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
        <div style={{ height: "100px" }}></div>
      </div>
      <div ref={popup} className="popup">
        <div className="popup-div">
          <div className="popup-content">
            <div className="animated-content">
              <div className="success-icon">
                <img src={userImg} alt="Success Icon" />
              </div>
              <span style={{ color: "red" }}>Username already exists</span>
            </div>
            <Button onClick={disablePopup}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewUserComponent;
