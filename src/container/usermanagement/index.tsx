import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import store from "../../store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import "./styles/_index.scss";
import { useNavigate } from "react-router-dom";
import { green, red } from "@mui/material/colors";
import { FiberManualRecord as FiberManualRecordIcon } from "@mui/icons-material";
import axios from "axios";
interface UserData {
  id: number;
  name: string;
  password: string;
  email_address: string;
  project_no: string;
  operation: string;
  lat: string;
  lon: string;
  site_route: string;
  start_date: string;
  end_date: string;
  expected_date: string;
  service_types: string;
  day_shift: string;
  user_type: string;
  night_shift: string;
  last_bill_update: string;
  client_id: string;
}
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const data = useSelector((state: any) => state?.app);
  const windowWidth = useRef(window.innerWidth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const menuOpen = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getUsersData = async () => {
    try {
      // Hardcoded user data
      const data = [
        {
          id: 26,
          name: "chok",
          password: "chok",
          user_type: "user",
          client: "CARIGALI HESS OPERATING COMPANY SDN BHD",
          operation: "CHOC-CKP-24-8460",
          email_address: "mdjasimcse07@gmail.com",
          telephone: "6540560",
          contract_no: "C44310",
          region: "Gulf of Thailand",
          vessel: "CKP LOCATION",
          lat: "7.16",
          lon: "103.09",
          site_route: "Singapore",
          start_date: "2020-01-16T00:00:00",
          end_date: "",
          expected_date: "2025-01-16T00:00",
          metsys_name: "metsys",
          service_types: "service",
          day_shift: "day",
          night_shift: "night",
          last_bill_update: "",
          wind: "\\\\sgsingwfsproc1\\METSYS\\PRODUCTION\\PUBLIC\\CHOC-01-Wind.gif",
          wave: "\\\\sgsingwfsproc1\\METSYS\\PRODUCTION\\PUBLIC\\CHOC-02-Wave.gif",
          current: "",
          satpic: "\\\\sgsingwfsproc1\\METSYS\\PRODUCTION\\PUBLIC\\CHOC-Satpic.jpg",
          client_id: "189",
          forecast_id: 2011,
        },
      ];
  
      // Set the hardcoded data to the users state
      // setUsers(data);
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };
  


  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
    const l = localStorage.getItem("sideNav");
    setSn(l);
  }, []);
  const hardcodedUsers = [
    {
      client_id: 189,
      client_name: "CARIGALI HESS OPERATING COMPANY",
    },
  ];
  
  const handleDelete = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this User?')) {
      try {
        // Simulate deletion by filtering out the user with the given id from the hardcoded data
        const updatedUsers = hardcodedUsers.filter((user) => user.client_id !== id);
  
        console.log('Updated users after deletion:', updatedUsers);
        // You can call a function like getUsersData() here to update the UI with the new data
        // For now, simulating that data has been re-fetched after deletion
        // await getUsersData();
  
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  

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
      style={open ? { marginLeft: 260, width: "calc(100% - 260px)" } : {}}
      className={"mainas"}
    >
      <div>
        <div className="tabel_users">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                style={{
                  padding: "10px 40px 10px 15px",
                  border: "2px solid #ccc",
                  borderRadius: "25px",
                  width: "200px",
                  fontSize: "16px",
                  outline: "none",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Username"
              />
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                  color: "#777",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </span>
            </div>
            <Button
              onClick={() => navigate("/addnewuser")}
              variant="contained"
              color="primary"
              style={{ margin: 18 }}
              className="add-user-button"
            >
              New User
            </Button>
          </div>
          <TableContainer className={"user-table-container"}>
            <Table style={{ borderRadius: 10 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderLeft: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Username
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Email Address
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Project Location
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Latitude
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Longitude
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Expected Date
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className="tabel_header"
                    style={{
                      borderRight: "1px solid #e0e0e0",
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .sort((a, b) => a.id - b.id)
                  .filter((data) => data.name.includes(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          borderLeft: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                        onClick={() => console.log(user.id)}
                      >
                        {user.id}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.name}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.email_address}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.operation}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.lat}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.lon}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.start_date}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.expected_date}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        {user.expected_date !== undefined &&
                        new Date(user.expected_date) > new Date() ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <FiberManualRecordIcon
                                style={{ color: green[500] }}
                              />
                              <span>Active</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <FiberManualRecordIcon
                                style={{ color: red[500] }}
                              />
                              <span>Inactive</span>
                            </div>
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: "center",
                          borderRight: "1px solid #e0e0e0",
                          padding: "0px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "0px",
                          }}
                        >
                          <EditIcon
                            fontSize="small"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/edit/${user.id}/`)}
                          />
                          <VisibilityIcon
                            fontSize="small"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/view/${user.id}/`)}
                          />
                          <DeleteIcon
                            fontSize="small"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => handleDelete(user.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};
export default UserManagement;
