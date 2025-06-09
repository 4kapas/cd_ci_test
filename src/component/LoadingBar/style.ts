//base
import styled, { keyframes } from "styled-components";
//libraries
//consts

const boxFadeIn = keyframes`
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(-360deg);
  }
`;
export const StyledLoadingBar = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #00000068;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    > p {
      font-family: "Pretendard";
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      text-align: center;
      color: #fff;
      margin-bottom: 0;
    }

    .loading-image-wrap {
      text-align: center;
      margin-bottom: 20px;
      animation: ${boxFadeIn} 2s 1s infinite linear;
    }
    /* .progress-bar-wrap {
      height: 20px;
      width: 120px;
      border-radius: 60px;
      background: #31c1b7;
      margin: 20px auto 0;
      position: relative;
      overflow: hidden;
      z-index: 8;
      .progresing-bar {
        border-radius: 60px;
        display: inline-block;
        position: absolute;
        width: 10%;
        top: 0;
        left: 0;
        height: inherit;
        background: #fff;
        z-index: 88;
      }
    } */
  }
`;
