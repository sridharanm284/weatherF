import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  Button,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import SelectImage from "../../../assets/background1.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface OperationsComponentProps {
  open: boolean;
  close: () => void;
  isAdmin: boolean;
}

interface OPdata {
  forecast_description: string;
  forecast_id: string;
}

export default function OperationsComponent(props: OperationsComponentProps) {
  const [open, setOpen] = useState(props.open);
  const [selectedValue, setSelectedValue] = useState("");
  const [clients, setClients] = useState<any>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>();
  const [oData, setOData] = useState<OPdata[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = async () => {
    const r = selectedValue.split(".");
    localStorage.setItem("fid", r[0]);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_IP}api/setoperation/`,
        {
          name: localStorage.getItem("user_name"),
          fd: r[1],
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa("admin:admin"),
          },
        }
      );
      props.close();
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error occurred during axios request:", error);
    }
  };

  useEffect(() => {
    if (selectedClientId || !props.isAdmin) {
      fetchData(selectedClientId as string);
    }
  }, [selectedClientId, props.isAdmin]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_IP}api/getclients/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchClients();
  }, [props.isAdmin]);

  const fetchData = async (clientId: string) => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_BACKEND_IP}api/operations12/${
        props.isAdmin ? clientId : localStorage.getItem("client_id")
      }/`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });
      setOData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (window.location.pathname === '/operations') {
    document.body.classList.add('hide-topbar');
  } else {
    document.body.classList.remove('hide-topbar');
  }
}, [window.location.pathname]);


  return props.open ? (
    <Dialog open={open} onClose={props.close}>
      <DialogTitle>Select Operations</DialogTitle>
      <DialogContent>
        <Grid
          container
          style={{ alignItems: "center", display: "flex" }}
          spacing={4}
        >
          <Grid item xs={12} sm={6}>
            <img src={SelectImage} alt="d" style={{ width: "100%" }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            {props.isAdmin && (
              <FormControl fullWidth>
                <Select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value as string);
                    fetchData(e.target.value as string);
                  }}
                  style={{ width: 250 }}
                  className="custom-select"
                >
                  <MenuItem value="">Select Clients</MenuItem>
                  {clients.map((option: any) => (
                    <MenuItem key={option.client_id} value={option.client_id}>
                      {option.client_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth>
              {loading ? (
                <CircularProgress />
              ) : (
                <Select
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  style={{ width: 250, marginTop: 10 }}
                  className="custom-select"
                >
                  <MenuItem value="">Select Operations</MenuItem>
                  {oData.map((option) => (
                    <MenuItem
                      key={option.forecast_id}
                      value={`${option.forecast_id}.${option.forecast_description}`}
                    >
                      {option.forecast_description}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button
                onClick={handleClose}
                variant="contained"
                disabled={
                  !(props.isAdmin ? selectedClientId : true) || !selectedValue
                }
              >
                Next
              </Button>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null;
}