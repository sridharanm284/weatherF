import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./_index.scss";
import SendIcon from "@mui/icons-material/Send";
import Modal from "@mui/material/Modal";
const style = {
  width: "80%",
  height: "88%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "whitesmoke",
  boxShadow: 24,
  p: 4,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
};
interface Props {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  setText: any;
  sendData: any;
  image: any[];
  text: string;
}
const BasicModal: React.FC<Props> = ({
  open,
  handleOpen,
  handleClose,
  image,
  sendData,
  text,
  setText,
}) => {
  const [mainv, setMainv] = useState("");
  const [name, setName] = useState("");
  const getUrl = (file: any) => {
    return URL.createObjectURL(file);
  };
  useEffect(() => {
    if (image.length > 0) {
      setMainv(URL.createObjectURL(image[0]));
    }
  }, [image]);
  return (
    <div>
      <Modal
        open={open}
        className="modal_product"
        onClose={(e: any) => {
          handleClose();
          setMainv("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button
            onClick={(e: any) => {
              handleClose();
              setMainv("");
            }}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            X
          </Button>
          <img
            src={mainv}
            className="mainImage"
            style={{ width: "70%", height: "70%" }}
            alt={name}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              overflow: "auto",
            }}
          >
            {image.map((data, idx) => {
              const link = getUrl(data);
              return (
                <img
                  className="smallimages"
                  style={{ width: 100, height: 100 }}
                  key={idx}
                  onClick={() => {
                    setMainv(link);
                    setName(data.name);
                  }}
                  src={link}
                  alt={data.name}
                />
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              width: "100%",
            }}
          >
            <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              required
              className="input_text_model"
              value={text}
              placeholder="Enter Your Message"
            />
            <button
              className="button_model"
              onClick={(e: any) => {
                sendData(e);
                handleClose();
                setMainv("");
              }}
            >
              Send Images <SendIcon />
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
export default BasicModal;
