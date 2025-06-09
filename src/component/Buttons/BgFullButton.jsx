import { StyledFullButton } from "./style";
import { themeOptions } from "@/styles/theme";

export const BgFullButton = ({
  theme = "greenFullLight",
  children,
  width = "117px",
  height = "40px",
  fontSize = "16px",
  fontWeight = "600",
  ...props
}) => {
  //TODO: 디자인 컬러 팔레트 시안에 없어서 추후 재정의 필요(23.09.09 진아름)
  const bgFullTheme = {
    greenFullLight: {
      fontColor: themeOptions.palette.white.main,
      bgColor: themeOptions.palette.green.light,
      hover: {
        fontColor: themeOptions.palette.white.main,
        bgColor: "#007A68",
      },
      disabled: {
        fontColor: "#98A2B3",
        bgColor: "#EBEEF1",
      },
    },
    blueFullLight: {
      fontColor: themeOptions.palette.white.main,
      bgColor: themeOptions.palette.blue.dark,
      hover: {
        fontColor: themeOptions.palette.white.main,
        bgColor: themeOptions.palette.blue.dark,
      },
      disabled: {
        fontColor: "#98A2B3",
        bgColor: "#EBEEF1",
      },
    },
  };
  const selectTheme =
    bgFullTheme[theme] ||
    bgFullTheme.greenFullLight ||
    bgFullTheme.blueFullLight;

  return (
    <StyledFullButton
      theme={selectTheme}
      width={width}
      height={height}
      fontSize={fontSize}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </StyledFullButton>
  );
};
