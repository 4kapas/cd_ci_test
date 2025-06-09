//libraries
import { Modal } from "@mui/material";
//style
import { StyledBox } from "./style";
import { useNavigate } from "react-router-dom";
import React from "react";

interface AlertModalProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactElement;
  handleConfirm?: () => void;
  setOpenSaveModal?: (open: boolean) => void;
  buttonTitle?: string;
  type?: "confirm" | "alert" | "save";
}

export const AlertModal = ({
  title,
  open,
  setOpen,
  children,
  handleConfirm,
  setOpenSaveModal,
  buttonTitle,
  type,
}: AlertModalProps) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
    if (setOpenSaveModal) {
      setOpenSaveModal(false);
    }
  };
  const handleMove = () => {
    navigate("/");
  };
  return (
    <Modal open={open}>
      <StyledBox width={"417px"} height={"auto"} style={{ background: "#fff" }}>
        <div className="modalHead">
          <h1>{title}</h1>
        </div>
        <div className="modalBody" style={{ background: "#fff" }}>
          {children}
          {type === "confirm" ? (
            <div className="modalButtonWrap" style={{ marginBottom: "20px" }}>
              <div className="modalButtons white">
                <button onClick={handleClose}>취소</button>
              </div>
              <div className="modalButtons">
                <button onClick={handleConfirm}>{buttonTitle || "확인"}</button>
              </div>
            </div>
          ) : type ? (
            <div className="modalButtonWrap" style={{ marginBottom: "20px" }}>
              <div className="modalButtons white">
                <button onClick={handleClose}>취소</button>
              </div>
              <div className="modalButtons">
                <button onClick={handleMove}>{buttonTitle || "나가기"}</button>
              </div>
            </div>
          ) : (
            <div className="modalButtons" style={{ marginBottom: "20px" }}>
              <button onClick={handleClose}>{buttonTitle || "확인"}</button>
            </div>
          )}
        </div>
      </StyledBox>
    </Modal>
  );
};
