import { useState, useEffect } from "react";
//mui
import { Select, MenuItem } from "@mui/material";
//style
import { StyledCommonSelect } from "./style";
//image
import { commonImage } from "@/consts/image";

const CommonSelectIcon = (props) => {
  return <img src={commonImage.selectArrowBlack} alt="select" {...props} />;
};

export const CommonSelect = ({ options, value, width, ...rest }) => {
  const defaultValue = options && options.length > 0 ? options[0].value : "";

  return (
    <StyledCommonSelect>
      <Select
        required
        IconComponent={CommonSelectIcon}
        value={value || defaultValue}
        sx={{
          width: width,
          color: "#000",
          fontSize: "14px",
          "& .MuiSelect-icon": {
            right: "13px",
          },
        }}
        {...rest}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            value={option.value}
            sx={{
              "&.MuiMenuItem-root:nth-of-type(1)": {
                display: "none",
                "& .MuiSvgIcon-root": {},
                "&:active": {},
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </StyledCommonSelect>
  );
};
