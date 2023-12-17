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
  } from '@mui/material';
import SelectImage from "../../../assets/vectos/operation.jpg";
import "./styles/_index.scss"; // Import custom styles for the component

interface OperationsComponentProps {
  open: boolean;
  close: () => void;
}

interface OPdata {
  forecast_description: string;
  forecast_id: string;
}

export default function OperationsComponent(props: OperationsComponentProps) {
  const [open, setOpen] = useState(props.open);
  const [selectedValue, setSelectedValue] = useState("");
  const [oData, setOData] = useState<OPdata[]>([]);

  const handleClose = async (e: any) => {
    const r = selectedValue.split(".");
    console.log(r[0]);
    localStorage.setItem("fid", r[0]);
    await fetch("http://127.0.0.1:8000/api/setoperation/", {
      method: "POST",
      body: JSON.stringify({
        name: localStorage.getItem("user_name"),
        fd: r[1],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    });
    props.close();
  };

  console.log(selectedValue);

  useEffect(() => {
    const get = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/operations/${localStorage.getItem(
          "client_id"
        )}/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa("admin:admin"),
          },
        }
      );
      const data = await res.json();
      setOData(data);
      console.log(data, "ssas");
    };
    get();
  }, []);

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
            <FormControl fullWidth>
              <Select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                style={{ width: 250 }}
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
            </FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button onClick={handleClose} variant="contained">
                Next
              </Button>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null;
}
