import React, { useState, useEffect, useRef } from "react";
import store from "../../../store";
import {
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface ClientNamesInterface {
  client_name: string;
  client_id: string;
}
const ViewUserComponent = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_IP}api/user/get/${id}/`);
          const data = response.data;
          setFormData(data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchData();
    }
   }, [id]);
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
            style={{
              backgroundColor: "blue",
              color: "white",
              margin: "10px 0",
            }}
          >
            Back
          </Button>
        </div>
        <div style={{ overflow: "auto" }}>
          <table className="view_user_table">
            <tr>
              <td className="title_td">Client:</td>
              <td>{formData.client}</td>
              <td className="title_td">Email Address: </td>
              <td>{formData.email_address}</td>
            </tr>
            <tr>
              <td className="title_td">Project Location: </td>
              <td>{formData.operation}</td>
              <td className="title_td">Contact Number:</td>
              <td>{formData.telephone}</td>
            </tr>
            <tr>
              <td className="title_td">Contract No: </td>
              <td>{formData.contract_no}</td>
              <td className="title_td">Region:</td>
              <td>{formData.region}</td>
            </tr>
            <tr>
              <td className="title_td">Site No: </td>
              <td>{formData.site_route}</td>
              <td className="title_td">Start Date:</td>
              <td>{formData.start_date}</td>
            </tr>
            <tr>
              <td className="title_td">User Type: </td>
              <td>{formData.user_type}</td>
              <td className="title_td">Expected Date:</td>
              <td>{formData.expected_date}</td>
            </tr>
            <tr>
              <td className="title_td">Metsys: </td>
              <td>{formData.metsys_name}</td>
              <td className="title_td">Service Types:</td>
              <td>{formData.service_types}</td>
            </tr>
            <tr>
              <td className="title_td">Day Shift: </td>
              <td>{formData.day_shift}</td>
              <td className="title_td">Night Shift:</td>
              <td>{formData.night_shift}</td>
            </tr>
            <tr>
              <td className="title_td">Latitude: </td>
              <td>{formData.lat}</td>
              <td className="title_td">Logitude:</td>
              <td>{formData.lon}</td>
            </tr>
            <tr>
              <td className="title_td">Wind:</td>
              <td>{formData.wind}</td>
              <td className="title_td">Wave:</td>
              <td>{formData.wave}</td>
            </tr>
            <tr>
              <td className="title_td">Satpic: </td>
              <td>{formData.satpic}</td>
              <td className="title_td">Current: </td>
              <td colSpan={3}>{formData.current}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ViewUserComponent;
