// libraries
import { Button } from "@mui/material";
// style
import { StyledBasicButton } from "./style";

export const BasicButton = ({
  variant = "text",
  title = null,
  label,
  href = null,
  width,
  onClick,
  children = null,
  bgColor,
  ...props
}) => {
  return (
    <StyledBasicButton width={width} bgColor={bgColor}>
      <Button
        variant={variant}
        href={href}
        disableRipple
        onClick={onClick}
        {...props}
      >
        {title || label || children}
      </Button>
    </StyledBasicButton>
  );
};
