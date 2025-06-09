//base
import styled from "styled-components";
//libraries
import Box from "@mui/material/Box";
//consts
import { commonImage } from "@/consts/image";

export const StyledBox = styled(Box)`
  /* padding: 24px; */
  outline: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.width ? props.width : null)};
  height: ${(props) => (props.height ? props.height : null)};
  background-color: #ffffff;
  box-shadow: 0 0 3px 0 rgba(135, 121, 121, 0.15);
  border-radius: 2px;
  overflow: hidden;
  background: #f9fafb;
  &.background-none {
    /* background: #fff !important; */

    .modalBody {
      padding: 0px 20px 0;
    }
    .topRow {
      &.not-padding {
        li {
          padding: 0;
        }
      }
      li {
        height: 40px;
        padding: 9px 14px;
        font-size: 16px;
        font-family: "Pretendard";
        line-height: 22.4px;
        cursor: pointer;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background: #dfe2e7;
        }
      }
    }
    .content {
      height: 420px;
      overflow: auto;
    }
    .filter {
      margin-top: 14px;
    }
  }
  .modalHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* height: 32px; */
    padding: 24px 20px;
    background: #ffffff;
    box-sizing: border-box;
    height: 72px;
    h1 {
      font-size: 20px;
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
    padding: 24px 20px 0;
    /* margin: 30px 0 0; */
    position: relative;
    /* height: ${(props) =>
      props.height ? `calc(${props.height} - 110px)` : null}; */

    h3 {
      font-size: 16px;
      font-weight: 500;
    }
  }

  .modalButtons {
    margin-top: 13px;
    position: relative;
    /* right: 0;
    bottom: 0; */
    display: flex;
    justify-content: flex-end;

    & + button {
      margin-left: 12px;
    }
  }

  button {
    margin-left: 12px;
    width: 80px;
    height: 40px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    word-wrap: break-word;
    background: #00a991;
    border-radius: 2px;
  }

  /* 의사결정지원시스템 시작하기 스타일 */
  .createHistoryModal {
    background: none;
  }
`;
