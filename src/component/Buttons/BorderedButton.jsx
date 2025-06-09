import React from "react";
import { StyledBorderButton } from "./style";
import { themeOptions } from "@/styles/theme";

export const BorderedButton = ({
  theme = "greenBorderLight",
  children,
  minWidth = "66px",
  height = "30px",
  fontSize = "14px",
  fontWeight = "400",
  ...props
}) => {
  //TODO: 디자인 컬러 팔레트 시안에 없어서 추후 재정의 필요(23.09.09 진아름)
  const borderButtonTheme = {
    greenBorderLight: {
      fontColor: themeOptions.palette.green.light,
      bgColor: themeOptions.palette.white.main,
      borderColor: themeOptions.palette.green.light,
      hover: {
        fontColor: themeOptions.palette.green.light,
        bgColor: themeOptions.palette.white.main,
      },
      disabled: {
        fontColor: "#98A2B3",
        bgColor: "#EBEEF1",
        borderColor: "#98A2B3",
      },
    },
  };
  const selectTheme =
    borderButtonTheme[theme] || borderButtonTheme.greenBorderLight;

  return (
    <StyledBorderButton
      theme={selectTheme}
      minWidth={minWidth}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </StyledBorderButton>
  );
};
