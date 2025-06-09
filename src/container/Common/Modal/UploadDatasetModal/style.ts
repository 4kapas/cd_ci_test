import styled from "styled-components";

export const StyledUploadDatasetModal = styled.div`
  background-color: var(--bs-gray-100);
  border-top: 1px solid var(--bs-green);
  box-sizing: border-box;
  height: max-content;
  background-color: var(--bs-white);
  display: flex;
  flex-flow: column nowrap;
  .main {
    box-sizing: border-box;
    padding: 16px;
    width: 100%;
    height: max-content;
    display: flex;
    flex-flow: column nowrap;
    gap: 8px;
    overflow-y: auto;
    .area {
      width: 100%;
      margin: 0;
      display: flex;
      flex-flow: column nowrap;
      gap: 8px;
      flex-shrink: 0;
      &.file-box {
        box-sizing: border-box;
        border-radius: 8px;
        height: 86px;
        overflow: hidden;
        &.selected {
          border: 1px solid var(--gray-300);
        }
        &.unselected {
          border: 2px dashed var(--gray-300);
        }
        & > input {
          display: none;
        }
        & > label {
          width: 100%;
          height: 100%;
          cursor: pointer;
          .selected {
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 12px;
            width: 100%;
            height: 100%;
            color: var(--primary-400);
            background-color: var(--gray-50);
            &:hover {
              background-color: var(--gray-100);
            }

            & > .box {
              display: flex;
              flex-flow: column nowrap;
              gap: 4px;
              flex: 1;
              box-sizing: border-box;
              padding: 0 12px;
              & > p {
                margin: 0;
                color: var(--gray-800);
                &.name {
                  font-size: 16px;
                }
                &.info span {
                  color: var(--gray-400);
                  font-size: 12px;
                }
              }
            }

            & > button {
              background-color: transparent;
              width: 32px;
              height: 32px;
              color: var(--gray-800);
              &:hover {
                background-color: var(--gray-300);
              }
            }
          }
          .unselected {
            width: 100%;
            height: 100%;
            display: flex;
            gap: 6px;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            color: var(--primary-400);
            & > p {
              font-size: 14px;
              color: var(--gray-900);
              margin: 0;
              & > span {
                font-size: inherit;
                color: var(--primary-400);
              }
              &.help {
                font-size: 10px;
                color: var(--gray-500);
              }
            }
            &:hover > p > span {
              text-decoration: underline;
            }
          }
        }
        &.dragging {
          background-color: #008a7520;
          border: 2px solid var(--primary-300);
        }
      }

      .box {
        box-sizing: border-box;
        width: 100%;
        height: max-content;
        &.required .label::after {
          content: "*";
          font-size: 10px;
          font-weight: 900;
          color: var(--state-error);
          /* position: absolute; */
          margin-left: 2px;
        }
        .label {
          font-size: 14px;
          color: var(--gray-900);
        }
        .field {
          width: 100%;
          margin-top: 4px;
          box-sizing: border-box;
          width: 100%;
          height: 40px;
          padding: 8px 12px;
          font-size: 16px;
          border: 1px solid var(--gray-300);
          background-color: var(--white);
          border-radius: 4px;
          color: var(--gray-900);
          &:focus {
            border: 1px solid var(--primary-400);
            background-color: var(--white);
            color: var(--black);
          }
          &::placeholder {
            color: rgb(210, 212, 216) !important;
          }
          &:placeholder-shown {
            background-color: var(--gray-50);
          }
        }
        .custom {
          width: 100%;
          display: flex;
          gap: 8px;
          & > .select-box {
            width: 36%;
          }
          & > .field {
            width: 64%;
            margin: 0;
          }
        }
      }
    }
  }
  .footer {
    padding: 16px;
    padding-top: 0;
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
    & > button {
      height: 36px;
      margin: 0;
      background-color: var(--primary-300);
      &:disabled {
        background-color: var(--gray-300);
        cursor: default;
      }
      &.prev {
        background-color: var(--white);
        color: var(--gray-900);
        border: 1px solid var(--gray-300);
      }
    }
  }
`;
