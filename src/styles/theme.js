import { createTheme } from "@mui/material/styles";

export const themeOptions = createTheme({
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
  },
  components: {
    // Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-input": {
            // height: '32px',
            // boxSizing: 'border-box'
          },
          ".MuiOutlinedInput-notchedOutline": {
            display: "none",
            "&.Mui-focused": {
              border: "1px solid",
              borderRadius:"2px"
            },
          },
        },
      },
    },

    // Input ver2
    MuiInputBase: {
      styleOverrides: {
        root: {
          width: "100%",
          "&:before": {
            borderBottomColor: "transparent!important",
            transition: "none!important",
          },
          "&:after": {
            borderBottom: "0!important",
            transition: "none!important",
          },
          ":hover:not(.Mui-disabled):before": {
            borderBottom: "1px solid",
          },
        },
      },
    },
    //select font size 셀렉트 고정 폰트사이즈
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
    },
    //Form
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: "0",
        },
      },
    },
    //searching input
    MuiTextField: {
      styleOverrides: {
        root: {
          ".MuiInputBase-root": {
            paddingRight: "0",
            border: "1px solid #DEE3E8",
            borderRadius: "2px",
          },
          ".MuiInputBase-input ": {
            height: "44px",
            padding: "0px 14px",
          },
        },
      },
    },
  },
  //TODO: 색상 팔레트 일괄 수정 필요 (23.09.08 진아름)
  palette: {
    fontColor: {
      main: "#2F2F35",
    },
    white: {
      main: "#ffffff",
    },
    green: {
      main: "#67B18F",
      light: "#00A991",
      dark: "#008774",
    },
    blue: {
      dark: "#079DB0",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 360,
      md: 600,
      lg: 1024,
      xl: 1440,
    },
  },
});
