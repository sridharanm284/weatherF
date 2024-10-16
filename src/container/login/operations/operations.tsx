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
  Snackbar,
  Alert,
} from "@mui/material";
import SelectImage from "../../../assets/background1.jpg";
import "./styles/_index.scss";
import axios from "axios";

interface OperationsComponentProps {
  open: boolean;
  close: () => void;
  isAdmin: boolean;
  selectedOperation?: string | null; 
  onOperationSelect?: (operation: string) => void; 
}

interface OPdata {
  forecast_description: string;
  forecast_id: string;
}

export default function OperationsComponent(props: OperationsComponentProps) {
  const [open, setOpen] = useState(props.open);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [oData, setOData] = useState<OPdata[]>([]);
  const [loading, setLoading] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  
  const handleClose = async () => {
    if (props.isAdmin && !selectedClientId) {
      setWarningOpen(true);
      return;
    }
    if (!selectedValue) {
      setWarningOpen(true);
      return;
    }

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
    } catch (error) {
      console.error("Error occurred during axios request:", error);
    }
  };


  useEffect(() => {
    if (props.isAdmin) {
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
          console.log("Clients fetched: ", response.data); 
          setClients(response.data);
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };
      fetchClients();
    }
  }, [props.isAdmin]);

  
  useEffect(() => {
    const fetchOperations = async () => {
      setLoading(true);
      try {
        const url = `${process.env.REACT_APP_BACKEND_IP}api/operations/${
          props.isAdmin ? selectedClientId : localStorage.getItem("client_id")
        }/`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa("admin:admin"),
          },
        });
        console.log("Operations fetched: ", response.data); 
        setOData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching operations:", error);
        setLoading(false);
      }
    };

    if (selectedClientId || !props.isAdmin) {
      fetchOperations();
    }
  }, [selectedClientId, props.isAdmin]);

  const handleWarningClose = () => {
    setWarningOpen(false);
  };

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
                  value={selectedClientId || ""}
                  onChange={(e) => {
                    console.log("Selected Client: ", e.target.value); 
                    setSelectedClientId(e.target.value);
                  }}
                  style={{ width: 250 }}
                  className="custom-select"
                >
                  <MenuItem value="">Select Clients</MenuItem>
                  {clients.map((option: any) => (
                    <MenuItem
                      key={option.client_id}
                      value={option.client_id}
                    >
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
                disabled={!(props.isAdmin ? selectedClientId : true) || !selectedValue}
              >
                Next
              </Button>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <Snackbar
        open={warningOpen}
        autoHideDuration={3000}
        onClose={handleWarningClose}
      >
        <Alert onClose={handleWarningClose} severity="warning" sx={{ width: "100%" }}>
          Please select both Client and Operations before proceeding.
        </Alert>
      </Snackbar>
    </Dialog>
  ) : null;
}
