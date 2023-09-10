// @format
import React, { useState, useEffect, useRef } from "react";
import "./styles/_index.scss";
import store from "../../store";
import { useTheme, useMediaQuery } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Logo from "../../assets/logoMain.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector } from "react-redux";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import BasicModal from "../../components/modal";

interface ChatMessage {
  id: number;
  file: string;
  user: string;
  imgfile: string;
  file_name: any;
  date_time: string;
  message: string;
}

interface Rooms {
  user_id: number;
  read_admin: string;
  user: string;
  operation: string;
  chat_id: string;
  unread_admin: string;
}

interface UserData1 {
  name: string;
  operation: string;
  client_id: string;
}

const ChatAdmin: React.FC = () => {
  const [message, setMessage] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [currentChat, setCurrentChat] = useState("");
  const [chatRoom, setChatRoom] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    operation: "",
  });
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [fileUrl, setFileUrl] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [toogleChats, setToogleChats] = useState(false);
  const [activeChat, setActiveChat] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [showFilemodal, setShowFileModal] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const getMessages = async () => {
    await callChats();
    msgRef &&
      msgRef.current &&
      msgRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getMessages();
    msgRef &&
      msgRef.current &&
      msgRef?.current.scrollIntoView({ behavior: "smooth" });
  }, [chatRoom, currentChat]);

  const drawerWidth = 240;

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const windowWidth = useRef<number>(window.innerWidth);

  const [open, setOpen] = useState<boolean>(
    windowWidth.current > 1000 ? true : false
  );
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

  const funcToogle = () => {
    setToogleChats(!toogleChats);
  };

  const getRooms = async () => {
    setToogleChats(true);
    try {
      let res = await fetch(`http://127.0.0.1:8000/api/listchats/`, {
        method: "POST",
        body: JSON.stringify({
          user: localStorage.getItem("token"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Basic " + btoa("admin:admin"),
        },
      });
      const data = await res.json();
      await setRooms(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const callChats = async () => {
    setLoading(true);
    if (currentChat === "") return;
    try {
      let res = await fetch(
        `http://127.0.0.1:8000/api/chatroom/${currentChat}/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: "Basic " + btoa("admin:admin"),
          },
        }
      );
      const data = await res.json();
      setMessage(data.chats);
      await setChatRoom(data.rooms.chat_id);
      await setUserData(data.userdata);

      console.log(chatRoom, "chatRoom");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const sendData = async (e: any) => {
    e.preventDefault();
    if (text !== "" || selectedFile.length > 0) {
      const l = selectedFile;
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic YWRtaW46YWRtaW4=");
      var formdata = new FormData();
      formdata.append("id", chatRoom);
      formdata.append("message", text);
      formdata.append("user", "admin");
      l &&
        l.forEach((sx: any) => {
          formdata.append(
            "file",
            sx,
            `${chatRoom}_message_${new Date()}_${sx.name}`
          );
        });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
      };
      try {
        let res = await fetch(
          "http://127.0.0.1:8000/api/sendmessage/",
          requestOptions
        );
        const data = await res.json();
        setText("");
        getMessages();
        setShowFileModal(false);
        setSelectedFile([]);
        setFileUrl([]);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Message Cannot be null");
    }
  };

  const readDatas = async (chat_id: string) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic YWRtaW46YWRtaW4=");
    var formdata = new FormData();
    formdata.append("id", chat_id);
    formdata.append("user", "admin");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };
    try {
      await fetch(
        "http://127.0.0.1:8000/api/readmessages/",
        requestOptions
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const saveFile = async (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files) as File[];
      setSelectedFile(filesArray);
      setShowFileModal(true);
    }
  };

  return (
    <div>
      <div
        style={open ? { marginLeft: 240, width: "calc(100% - 240px)" } : {}}
        className={"main"}
      >
        <div className={`content-wrap chatwrap`}>
          <div className={"main"}>
            <div className="chat admin_chat">
              <BasicModal
                open={showFilemodal}
                sendData={sendData}
                setText={setText}
                text={text}
                image={selectedFile}
                handleClose={() => {
                  setShowFileModal(false);
                  setFileUrl([]);
                }}
                handleOpen={() => setShowFileModal(true)}
              />
              <div style={{ position: "relative" }} className="top_container">
                {!isMobile ? (
                  <div style={{ padding: 20 }} className="rooms">
                    <div className="admin_chat_message_head">
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        Messages
                        <svg
                          width="12"
                          height="7"
                          viewBox="0 0 12 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.0469 1.76172L6.59375 5.95117C6.44727 6.09766 6.27148 6.15625 6.125 6.15625C5.94922 6.15625 5.77344 6.09766 5.62695 5.98047L1.17383 1.76172C0.880859 1.49805 0.880859 1.05859 1.14453 0.765625C1.4082 0.472656 1.84766 0.472656 2.14062 0.736328L6.125 4.48633L10.0801 0.736328C10.373 0.472656 10.8125 0.472656 11.0762 0.765625C11.3398 1.05859 11.3398 1.49805 11.0469 1.76172Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="search_input">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M13.7812 13.6289L10.1172 9.96484C10.9102 9.00781 11.3477 7.77734 11.3477 6.4375C11.3477 3.32031 8.77734 0.75 5.66016 0.75C2.51562 0.75 0 3.32031 0 6.4375C0 9.58203 2.54297 12.125 5.66016 12.125C6.97266 12.125 8.20312 11.6875 9.1875 10.8945L12.8516 14.5586C12.9883 14.6953 13.1523 14.75 13.3438 14.75C13.5078 14.75 13.6719 14.6953 13.7812 14.5586C14.0547 14.3125 14.0547 13.9023 13.7812 13.6289ZM1.3125 6.4375C1.3125 4.03125 3.25391 2.0625 5.6875 2.0625C8.09375 2.0625 10.0625 4.03125 10.0625 6.4375C10.0625 8.87109 8.09375 10.8125 5.6875 10.8125C3.25391 10.8125 1.3125 8.87109 1.3125 6.4375Z"
                          fill="black"
                        />
                      </svg>
                      <input
                        className="input"
                        onChange={(e) => setSearchUsers(e.target.value)}
                        type="search"
                        placeholder="Search Users"
                      />
                    </div>
                    <div
                      style={{
                        height: "75vh",
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {rooms
                        ?.filter((data) => data.user.includes(searchUsers))
                        ?.map((data) =>
                          data.user_id.toString() ===
                          localStorage.getItem("user_id") ? null : (
                            <div
                              onClick={() => {
                                setCurrentChat(data.user_id.toString());
                                setToogleChats(!toogleChats);
                                setActiveChat(data.chat_id);
                                readDatas(data.chat_id);
                              }}
                              className={`button_chat ${
                                data.chat_id === activeChat ? "active_chat" : ""
                              }`}
                            >
                              <div className="button_chat_userprofile">
                                {data?.user.slice(0, 1)}
                              </div>
                              <div className="button_chat_usercontent">
                                <div className="button_chat_user_name">
                                  {data?.user}
                                </div>
                                <div className="button_chat_user_operation">
                                  {data?.operation}
                                </div>
                              </div>
                              {((+data.unread_admin) !== 0) &&
                                <div className="badge">{data.unread_admin}</div>
                              }
                            </div>
                          )
                        )}
                    </div>
                  </div>
                ) : toogleChats ? (
                  <div className="rooms1" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      Messages
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.0469 1.76172L6.59375 5.95117C6.44727 6.09766 6.27148 6.15625 6.125 6.15625C5.94922 6.15625 5.77344 6.09766 5.62695 5.98047L1.17383 1.76172C0.880859 1.49805 0.880859 1.05859 1.14453 0.765625C1.4082 0.472656 1.84766 0.472656 2.14062 0.736328L6.125 4.48633L10.0801 0.736328C10.373 0.472656 10.8125 0.472656 11.0762 0.765625C11.3398 1.05859 11.3398 1.49805 11.0469 1.76172Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div className="search_input">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M13.7812 13.6289L10.1172 9.96484C10.9102 9.00781 11.3477 7.77734 11.3477 6.4375C11.3477 3.32031 8.77734 0.75 5.66016 0.75C2.51562 0.75 0 3.32031 0 6.4375C0 9.58203 2.54297 12.125 5.66016 12.125C6.97266 12.125 8.20312 11.6875 9.1875 10.8945L12.8516 14.5586C12.9883 14.6953 13.1523 14.75 13.3438 14.75C13.5078 14.75 13.6719 14.6953 13.7812 14.5586C14.0547 14.3125 14.0547 13.9023 13.7812 13.6289ZM1.3125 6.4375C1.3125 4.03125 3.25391 2.0625 5.6875 2.0625C8.09375 2.0625 10.0625 4.03125 10.0625 6.4375C10.0625 8.87109 8.09375 10.8125 5.6875 10.8125C3.25391 10.8125 1.3125 8.87109 1.3125 6.4375Z"
                          fill="black"
                        />
                      </svg>
                      <input
                        onChange={(e) => setSearchUsers(e.target.value)}
                        type="search"
                        className="input"
                        placeholder="Search Users"
                      />
                    </div>
                    {rooms
                      ?.filter((data) => data.user.includes(searchUsers))
                      ?.map((data) =>
                        data.user_id.toString() ===
                        localStorage.getItem("user_id") ? null : (
                          <div
                            onClick={() => {
                              setCurrentChat(data.user_id.toString());
                              setToogleChats(!toogleChats);
                              setActiveChat(data.chat_id);
                            }}
                            className={`button_chat ${
                              data.chat_id === activeChat ? "active_chat" : ""
                            }`}
                          >
                            <div className="button_chat_userprofile">
                              {data?.user?.slice(0, 1)}
                            </div>
                            <div className="button_chat_usercontent">
                              <div className="button_chat_user_name">
                                {data?.user}
                              </div>
                              <div className="button_chat_user_operation">
                                {data?.operation}
                              </div>
                            </div>
                            {((+data.unread_admin) !== 0) &&
                              <div className="badge">{data.unread_admin}</div>
                            }
                          </div>
                        )
                      )}
                  </div>
                ) : null}
                {!toogleChats ? (
                  <div
                    className="admin_left_side"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      height: "90%",
                      justifyContent: "space-between",
                    }}
                  >
                    {message?.length > 0 ? (
                      <div className="messages_header">
                        <p
                          style={{
                            fontSize: 20,
                            color: "darkblue",
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          {isMobile && (
                            <IconButton onClick={funcToogle} color="inherit">
                              <ArrowBackIcon />
                            </IconButton>
                          )}
                          <Avatar>{userData?.name.slice(0, 1)}</Avatar>{" "}
                          {userData?.name}
                        </p>
                        <p style={{ fontSize: 13, color: "blue" }}>
                          {userData?.operation}
                        </p>
                      </div>
                    ) : null}
                    <div
                      className={`messages ${
                        message.length > 0 ? "adminmes" : ""
                      }`}
                    >
                      {message.length > 0 ? (
                        message?.map((data, idx) => {
                          const d1 = new Date(data.date_time);
                          const isImage =
                            /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(
                              data.file_name
                            );
                          const newid =
                            idx !== message.length - 1 ? idx + 1 : idx;

                          return (
                            <div
                              key={idx}
                              className={`chat_container_${
                                data.user === "admin" ? "admina" : "usera"
                              }`}
                            >
                              <div className="message_conatiner">
                                <div
                                  style={{ alignItems: "flex-end" }}
                                  className={`message_${
                                    data.user === "admin" ? "admin" : "user"
                                  } ${
                                    data.imgfile !== null
                                      ? isImage
                                        ? "imga"
                                        : "file1"
                                      : null
                                  }`}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 20,
                                      alignItems: "",
                                    }}
                                  >
                                    {data.imgfile ? (
                                      isImage ? (
                                        data.imgfile ? (
                                          <img src={data.imgfile} />
                                        ) : null
                                      ) : (
                                        <a
                                          target="_bank"
                                          className="button_file"
                                          href={data.imgfile}
                                        >
                                          {data.file_name}
                                        </a>
                                      )
                                    ) : null}
                                    {data.imgfile !== null
                                      ? message[idx]?.message === data?.message
                                        ? null
                                        : data?.message
                                      : data?.message}
                                    {data?.imgfile !== null
                                      ? message[idx + 1]?.message ===
                                        data?.message
                                        ? null
                                        : data?.message
                                      : null}
                                  </div>
                                  <div
                                    className={`time_${
                                      data.user === "admin" ? "admina" : "usera"
                                    }`}
                                  >
                                    {d1.toISOString().slice(11, 16)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            marginTop: 50,
                            position: "sticky",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={Logo}
                            style={{ height: 300, width: 500, opacity: 0.2 }}
                            alt="null data"
                          />
                        </div>
                      )}
                    </div>
                    <div ref={msgRef}>&nbsp;</div>
                    {message.length > 0 ? (
                      <form onSubmit={sendData} className="inputcontainer">
                        <input
                          type="file"
                          multiple
                          onChange={saveFile}
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                        <AttachFileIcon onClick={handleFileSelect} />
                        <input
                          onChange={(e) => setText(e.target.value)}
                          type="text"
                          required
                          className="input_text"
                          value={text}
                          placeholder="Enter Your Message"
                        />
                        <button className="button" onClick={sendData}>
                          <SendIcon />
                        </button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  !isMobile && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      {message?.length > 0 ? (
                        <div className="messages_header">
                          <p
                            style={{
                              fontSize: 20,
                              color: "darkblue",
                              display: "flex",
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            {isMobile && (
                              <IconButton onClick={funcToogle} color="inherit">
                                <ArrowBackIcon />
                              </IconButton>
                            )}
                            <Avatar>{userData?.name.slice(0, 1)}</Avatar>{" "}
                            {userData?.name}
                          </p>
                          <p style={{ fontSize: 13, color: "blue" }}>
                            {userData?.operation}
                          </p>
                        </div>
                      ) : null}
                      <div
                        className={`messages ${
                          message.length > 0 ? "adminmes" : ""
                        }`}
                      >
                        {message.length > 0 ? (
                          message?.map((data, idx) => {
                            const d1 = new Date(data.date_time);
                            const isImage =
                              /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(
                                data.file_name
                              );
                            const newid =
                              idx !== message.length - 1 ? idx + 1 : idx;
                            return (
                              <div
                                key={idx}
                                className={`chat_container_${
                                  data.user === "admin" ? "admina" : "usera"
                                }`}
                              >
                                <div className="message_conatiner">
                                  <div
                                    style={{ alignItems: "flex-end" }}
                                    className={`message_${
                                      data.user === "admin" ? "admin" : "user"
                                    } ${
                                      data.imgfile !== null
                                        ? isImage
                                          ? "imga"
                                          : "file1"
                                        : null
                                    }`}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 20,
                                        alignItems: "",
                                      }}
                                    >
                                      {data.imgfile ? (
                                        isImage ? (
                                          data.imgfile ? (
                                            <img src={data.imgfile} />
                                          ) : null
                                        ) : (
                                          <a
                                            target="_bank"
                                            className="button_file"
                                            href={data.imgfile}
                                          >
                                            {data.file_name}
                                          </a>
                                        )
                                      ) : null}
                                      {data.imgfile !== null
                                        ? message[idx]?.message ===
                                          data?.message
                                          ? null
                                          : data?.message
                                        : data?.message}
                                      {data?.imgfile !== null
                                        ? message[idx + 1]?.message ===
                                          data?.message
                                          ? null
                                          : data?.message
                                        : null}
                                    </div>
                                    <div
                                      className={`time_${
                                        data.user === "admin"
                                          ? "admina"
                                          : "usera"
                                      }`}
                                    >
                                      {d1.toISOString().slice(11, 16)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                              overflow: "hidden",
                              marginTop: 50,
                              position: "sticky",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={Logo}
                              style={{ height: 300, width: 500, opacity: 0.2 }}
                              alt="null data"
                            />
                          </div>
                        )}
                        <div ref={msgRef}>&nbsp;</div>
                      </div>
                      {message.length > 0 && (
                        <form onSubmit={sendData} className="inputcontainer">
                          <input
                            type="file"
                            accept="*"
                            multiple
                            onChange={saveFile}
                            style={{ display: "none" }}
                            ref={fileInputRef}
                          />
                          <AttachFileIcon onClick={handleFileSelect} />
                          <input
                            onChange={(e) => setText(e.target.value)}
                            type="text"
                            required
                            className="input_text"
                            value={text}
                            placeholder="Enter Your Message"
                          />
                          <button className="button" onClick={sendData}>
                            <SendIcon />
                          </button>
                        </form>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;