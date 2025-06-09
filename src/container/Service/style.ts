//@ts-nocheck
import styled from "styled-components";

export const StyledService = styled.div`
  display: flex;
  flex-direction: column;

  #potree_ctn {
    position: relative;
    height: calc(100dvh - 120px);
  }

  .potree_container {
    position: relative;

    .split-layer {
      height: 100%;
      position: absolute;
      overflow: hidden;
      top: 0;
      width: 50%;
      & > div {
        position: absolute;
        top: 0;
        width: 100vw !important;
        height: 100%;
      }
      &.before {
        left: 0;
        & > div {
          left: 0;
        }
      }
      &.after {
        right: 0;
        & > div {
          left: -100%;
        }
      }
    }

    .after-area {
      /* width: 100%;
      height: 100%;
      position: absolute; */
    }
  }
`;
