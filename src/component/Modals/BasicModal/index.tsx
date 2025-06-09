// libraries
import { Modal } from "@mui/material";
import { StyledBox } from "../style";

interface BasicModalProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (visible: boolean) => void;
  width: string;
  height: string;
  className?: string;
  option?: {
    enabledBodyPadding?: boolean;
    disableBackdropClick?: boolean;
  };
}

export const BasicModal = ({
  title,
  children,
  open,
  setOpen,
  width,
  height,
  className,
  option,
}: BasicModalProps) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (option?.disableBackdropClick && reason !== "backdropClick")
          handleClose();
      }}
    >
      <StyledBox width={width} height={height} className={className}>
        <div className="modalHead">
          <h1>{title}</h1>
          <button
            onClick={() => setOpen(false)}
            className="modalCloseButton"
          ></button>
        </div>
        <div
          className="modalBody"
          style={{
            padding: option?.enabledBodyPadding ? "0" : "",
          }}
        >
          {children}
        </div>
      </StyledBox>
    </Modal>
  );
};
