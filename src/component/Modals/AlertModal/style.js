import styled from "styled-components";
import Box from "@mui/material/Box";
import { commonImage } from "@/consts/image";

export const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.width ? props.width : null)};
  height: ${(props) => (props.height ? props.height : null)};
  background-color: #ffffff;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  overflow: hidden;
  background: #f9fafb;
  .modalHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 26px 20px 14px;
    background: #ffffff;
    box-sizing: border-box;
    h1 {
      font-size: 18px;
      font-weight: 600;
      line-height: unset;
      margin-bottom: 0;
    }

    .modalCloseButton {
      width: 29px;
      height: 29px;
      background-image: url(${commonImage.close});
      background-repeat: no-repeat;
      margin-left: 0;
      background-size: 100%;
      background-repeat: no-repeat;
      background-color: unset;
    }
  }

  .modalBody {
    position: relative;
    padding: 0px 20px;

    p {
      word-break: keep-all;
      margin-bottom: 14px;
      font-size: 15px;
      font-family: Pretendard;
      font-weight: 400;
      line-height: 24px;
    }
    .modalButtonWrap {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .modalButtons {
        margin-top: 0;

        &.white {
          button {
            width: 68px;
            background: #fff;
            color: #8992a1;
            border: 1px solid #dfe2e7;
          }
        }
      }
    }
  }

  .modalButtons {
    margin-top: 14px;
    position: relative;
    display: flex;
    justify-content: flex-end;

    & + button {
      margin-left: 12px;
    }
  }

  button {
    margin-left: 12px;
    width: 81px;
    height: 36px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    word-wrap: break-word;
    background: #00a991;
    border-radius: 2px;
  }
`;
