import React, { useState, useEffect, useRef } from "react";
import "./styles/_index.scss";
import store from "../../store";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import BasicModal from "../../components/modal";
import useWebSocket from 'react-use-websocket';

interface ChatMessage {
  id: number;
  user: string;
  date_time: string;
  imgfile: string;
  file_name: any;
  message: string;
}

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

  const [socketOpened, setSocketOpened] = useState(false)
  const socketUrl = `ws://localhost:8001/ws/chat/${localStorage.getItem("user_id")}/`;
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {console.log('WS Opened'); setSocketOpened(true); sendJsonMessage({mode: 'createchat', user_id: localStorage.getItem("user_id"), user: 'user'});},
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) =>  processWebSocketMessages(event)
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
    let data = JSON.parse(event.data)
    if (data.mode === 'createchat') {
      console.log(data)
      setMessage(data.chats);
      setChatRoom(data.rooms.chat_id);
      msgRef &&
        msgRef.current &&
        msgRef?.current.scrollIntoView({ behavior: "smooth" });
      sendJsonMessage({mode: 'readmessages', chat_id: data.chats.chat_id, user_id: localStorage.getItem("user_id"), user: 'user'})
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
      // l &&
      //   l.forEach((sx: any) => {
      //     formdata.append(
      //       "file",
      //       sx,
      //       `${chatRoom}_message_${new Date()}_${sx.name}`
      //     );
      //   });
      sendJsonMessage({mode: 'sendmessage', chat_id: chatRoom, message: text, user: 'user'})
      setText("");
      sendJsonMessage({mode: 'readmessages', chat_id: localStorage.getItem("user_id"), user: 'user'});
      setSelectedFile([]);
      setShowFileModal(false);
      setFileUrl([]);
      console.log(data);
    } else {
      alert("Message Cannot be null");
    }
  };

  console.log(localStorage.getItem("sideNav"));

  return (
    <div>
      <div
        style={open ? { marginLeft: 240, width: "calc(100% - 240px)" } : {}}
        className={"main"}
      >
        {data.unread_admin > 0 && <div className="badge">{data.unread_admin}</div>}

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
                  const d1 = new Date(data.date_time);
                  const isImage = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(
                    data.file_name
                  );
                  return (
                    <div
                      key={idx}
                      className={`chat_container_${
                        data.user === "admin" ? "admin" : "user"
                      }`}
                    >
                      <div className="message_conatiner">
                        <div
                          style={{
                            alignItems: "flex-end",
                          }}
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
                                  {data?.file_name}
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
                              data.user === "admin" ? "admin" : "user"
                            }`}
                          >
                            {d1.toISOString().slice(11, 16)}
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
