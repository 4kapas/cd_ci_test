import styled from "styled-components";

export const StyledChangeDetectorStep2 = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;

  .body {
    display: flex;
    flex-flow: column nowrap;

    .field {
      display: flex;
      align-items: center;
      border: 1px solid var(--gray-300);
      border-bottom: none;
      &:last-child {
        border-bottom: 1px solid var(--gray-300);
      }
      /* gap: 16px; */

      .label {
        padding: 4px 16px;
        min-width: 100px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 700;
        background-color: var(--gray-50);
        color: var(--gray-1000);
        position: relative;
      }

      &.required .label::after {
        content: "*";
        font-size: 10px;
        font-weight: 900;
        color: var(--state-error);
        /* position: absolute; */
        margin-left: 2px;
      }

      .value {
        width: 100%;
        color: var(--gray-700);
        font-size: 12px;
        padding: 4px 16px;

        input {
          outline: none;
          width: 200px;
          height: 24px;
          box-sizing: border-box;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid var(--gray-300);
          background-color: var(--gray-50);
          transition: all 0.2s ease;
          color: var(--gray-700);
          &:focus {
            border: 1px solid var(--primary-400);
            background-color: var(--white);
            color: var(--black);
          }
          &::placeholder {
            color: rgb(210, 212, 216) !important;
          }
        }

        select {
          height: 24px;
          /* line-height: 24px; */
          outline: none;
          width: max-content;
          box-sizing: border-box;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid var(--gray-300);
          background-color: var(--gray-50);
          transition: all 0.2s ease;
          color: var(--gray-700);
          cursor: pointer;
        }
      }
    }
  }

  .footer {
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
    .message > p {
      margin: 0;
      font-size: 10px;
      color: var(--state-error);
      padding-right: 12px;
    }
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
