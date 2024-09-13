/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useRef } from "react";
import "./styles/_index.scss";
import store from "../../store";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import BasicModal from "../../components/modal";
import useWebSocket from "react-use-websocket";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

interface ChatMessage {
  id: number;
  user_type: string;
  date_time: string;
  imgfile: string;
  file: any;
  message: string;
  token: string;
}

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{display:'flex'}}>
      <img src={`${process.env.REACT_APP_BACKEND_IP}uploads/`+imageUrl} alt="Preview"/>
      <CloseIcon
                  style={{ color: "white", cursor: "pointer", paddingLeft: '20px' }}
                  fontSize="medium"
      />
      </div>
  </div>);
};

const ChatAppClient: React.FC = () => {
  const [message, setMessage] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [chatRoom, setChatRoom] = useState("");
  const [sn, setSn] = useState(localStorage.getItem("sideNav"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<any[]>([]);
  const [showFilemodal, setShowFileModal] = useState(false);
  const msgRef = useRef<HTMLInputElement>(null);
  const data = useSelector((state: any) => state?.app);
  const windowWidth = useRef(window.innerWidth);
  const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);

  const [socketOpened, setSocketOpened] = useState(false);
  const socketUrl = `ws://${process.env.REACT_APP_WEBSOCKET_IP}/ws/chat/${localStorage.getItem(
    "user_id"
  )}/`;
  const {
    sendJsonMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      setSocketOpened(true);
      sendJsonMessage({
        mode: "createchat",
        user_id: localStorage.getItem("user_id"),
        user_type: "user",
        token: localStorage.getItem("token"),
      });
    },
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) => processWebSocketMessages(event),
  });

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  const drawerWidth = 260;

  function processWebSocketMessages(event: any) {
    let data = JSON.parse(event.data);
    if (
      data.rooms &&
      data.user_type == "user" &&
      data.rooms.user_id == localStorage.getItem("user_id")
    ) {
      localStorage.setItem("rooms", data.rooms.chat_id);
    }
    if (
      data.mode === "createchat" &&
      data.rooms.chat_id == localStorage.getItem("rooms")
    ) {
      if (data.user_type != "admin") {
        if (data.chats !== null) {
          setMessage(data.chats);
          setChatRoom(data.rooms.chat_id);
          if (data.user_type != "admin")
            msgRef &&
              msgRef.current &&
              msgRef?.current.scrollIntoView({ behavior: "smooth" });
          sendJsonMessage({
            mode: "readmessages",
            chat_id: data.rooms.chat_id,
            user_type: "user",
          });
        }
      }
    } else if (
      data.mode === "latest" &&
      (localStorage.getItem("rooms") === data.rooms.chat_id ||
        localStorage.getItem("rooms") === data.chats[0].chat_id)
    ) {
      if (data.user_type) {
        var chats = [...message, data.chats];
        if (1) {
          setMessage(data.chats);
          setChatRoom(data.rooms.chat_id);
          msgRef &&
            msgRef.current &&
            msgRef?.current.scrollIntoView({ behavior: "smooth" });
          sendJsonMessage({
            mode: "readmessages",
            chat_id: data.rooms.chat_id,
            user_type: "user",
          });
        }
      }
    } else if (
      data.mode === "sendmsg" &&
      data.chat_id == localStorage.getItem("rooms")
    ) {
      sendJsonMessage({
        mode: "latest",
        user_id: localStorage.getItem("user_id"),
        user_type: "user",
        token: localStorage.getItem("token"),
        send_by: "user",
      });
    } else if (data.mode === "receivemsg") {
      if (data.chats !== null) {
        setMessage(data.chats);
      }
    }
  }

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const saveFile = async (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files) as File[];
      setSelectedFile(filesArray);
      filesArray.forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFileUrl([...fileUrl, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setShowFileModal(true);
    }
  };
  const sendData = async (e: any) => {
    e.preventDefault();
    if (text !== "" || selectedFile.length > 0) {
      const l = selectedFile;
      if (l && l.length !== 0) {
        const formData = new FormData();
        formData.append("id", chatRoom);
        formData.append("message", text);
        formData.append("user", "user");
        l.forEach((sx: any) => {
          formData.append("file", sx, `${sx.name}`);
        });
        setSelectedFile([]);
        setText("");
        const config = {
          headers: {
            'Authorization': 'Basic YWRtaW46YWRtaW4='
          }
        };
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_BACKEND_IP}api/sendmessage/`,
            formData,
            config
          );
          sendJsonMessage({
            mode: "latest",
            user_id: localStorage.getItem("user_id"),
            user_type: "user",
            token: localStorage.getItem("token"),
            send_by: "user",
            select: "false",
          });
        } catch (error) {
          console.log("Error:", error);
          return;
        }
      } else {
        sendJsonMessage({
          mode: "sendmessage",
          chat_id: chatRoom,
          message: text,
          user_type: "user",
          user_id: localStorage.getItem("user_id"),
          send_by: "user",
        });
        setText("");
        sendJsonMessage({
          mode: "readmessages",
          chat_id: chatRoom,
          user_type: "user",
        });
        setSelectedFile([]);
        setShowFileModal(false);
        setFileUrl([]);
      }
    } else {
      alert("Message Cannot be null");
    }
  }

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <div
        style={open ? { marginLeft: 240, width: "calc(100% - 240px)" } : {}}
        className={"main"}
      >
        {data.unread_admin > 0 && (
          <div className="badge">{data.unread_admin}</div>
        )}

        <div className={`content-wrap chatwrap`}>
          <div className={"main"}>
            <div style={{ position: "relative" }} className="chat">
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
              <div className="messages">
                {message?.map((data, idx) => {
                  const formatter = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false, // Use 24-hour format
                  });
                  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  const currentTime = new Date(data.date_time);
                  const isImage = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(
                    data.file
                  );
                  return (
                    <div
                      key={idx}
                      className={`chat_container_${
                        data.user_type === "admin" ? "admin" : "user"
                      }`}
                    >
                      <div className="message_conatiner">
                        <div
                          style={{
                            alignItems: "flex-end",
                          }}
                          className={`message_${
                            data.user_type === "admin" ? "admin" : "user"
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
                              alignItems: "",
                            }}
                            className={data.file ? "" : "message_content"}
                          >
                            {data.file ? (
                              isImage ? (
                                data.imgfile ? (
                                  <h1>Hello</h1>
                                ) : (
                                  
                                  // eslint-disable-next-line jsx-a11y/alt-text
                                  <>
                                  <img src={`${process.env.REACT_APP_BACKEND_IP}uploads/`+data.file} alt="Picture" onClick={() => {setModalIsOpen(true); setImagePreview(data.file)}}/>
                                  {modalIsOpen && <ImageModal imageUrl={imagePreview} onClose={closeModal} />}
                                  </>
                                )
                              ) : (
                                <a
                                  target="_bank"
                                  className="button_file"
                                  href={data.imgfile}
                                >
                                  {data?.file}
                                </a>
                              )
                            ) : null}
                            {data.imgfile !== null
                              ? message[idx]?.message === data?.message
                                ? null
                                : data?.message
                              : data?.message}
                            {data?.imgfile !== null
                              ? message[idx + 1]?.message === data?.message
                                ? null
                                : data?.message
                              : null}
                          </div>
                          <div
                            className={`time_${
                              data.user_type === "admin" ? "admin" : "user"
                            }`}
                          >
                          {currentTime.toLocaleTimeString([], {
                                      timeZone: userTimeZone,
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgRef}></div>
              </div>
              <form onSubmit={sendData} className="inputcontainer">
                <input
                  type="file"
                  onChange={saveFile}
                  multiple
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAppClient;