import styled from "styled-components";

export const StyledChangeDetectorModal = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background-color: var(--bs-gray-100);
  border-top: 1px solid var(--bs-green);
  box-sizing: border-box;
  height: 400px;
  background-color: var(--bs-white);
  .stepper-box {
    box-sizing: border-box;
    width: 32%;
    padding: 24px 20px;
    border-right: 1px solid #1e9a85;
    /* border-radius: 8px; */
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;

    .step {
      display: flex;
      align-items: center;
      width: 100%;
      height: 57.4px;
      gap: 8px;
      p {
        margin: 0;
      }
      .area {
        margin: 0;
        .step-count {
          color: var(--bs-gray-400);
          font-size: 10px;
        }
        .step-label {
          color: var(--bs-gray-500);
          font-size: 14px;
          line-height: 24px;
        }
      }
      .icon {
        width: 38px;
        height: 38px;
        padding: 6px;
        border-radius: 50%;
        color: #fff;
        background: var(--bs-gray-500);
      }
      .point {
        box-sizing: content-box;
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        background-color: var(--bs-gray-500);
        border: 2px solid var(--bs-gray-500);
        border-radius: 50%;
        position: relative;
        & > svg {
          width: 14px;
          height: 14px;
          color: #fff;
        }

        .loading {
          box-sizing: border-box;
          border-radius: 50%;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          border: 2px solid #1e9a85;
          border-right: 2px solid transparent;
          animation: loading 1s linear infinite;
        }
        &::before {
          position: absolute;
          bottom: calc(100% + 2px);
          content: "";
          width: 2px;
          height: 53.4px;
          background-color: var(--bs-gray-500);
        }
      }
      &:first-child .point::before {
        height: 18.7px;
      }
      &:last-child .point::after {
        position: absolute;
        top: calc(100% + 2px);
        content: "";
        width: 2px;
        height: 18.7px;
        background-color: var(--bs-gray-500);
      }
      &.active .point {
        background-color: transparent;
        border: 2px solid #1e9a85;
        &::before,
        &::after {
          background-color: #1e9a85;
        }
      }
      &.success .point {
        background-color: #1e9a85;
        border: 2px solid #1e9a85;
        &::before,
        &::after {
          background-color: #1e9a85;
        }
      }

      &.active,
      &.success {
        .step-count {
          color: var(--bs-gray-500);
        }
        .step-label {
          color: var(--bs-gray-900);
        }
        .step-desc {
          display: block;
          color: var(--bs-gray-600);
        }
        .icon {
          background: linear-gradient(108deg, #1e9a85 17.48%, #1c6aac 100%);
        }
      }

      &.error {
        .icon {
          background: linear-gradient(
            108deg,
            var(--state-error) 17.48%,
            var(--state-warning) 100%
          );
        }
        .point {
          background-color: var(--state-warning);
          border: 2px solid var(--state-warning);
          &::before,
          &::after {
            background-color: var(--state-warning);
          }
        }
      }
    }
  }
  .main-box {
    box-sizing: border-box;
    padding: 16px;
    width: 68%;
    height: 100%;
  }

  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
