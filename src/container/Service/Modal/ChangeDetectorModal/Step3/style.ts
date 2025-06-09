import styled from "styled-components";

export const StyledChangeDetectorStep3 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .progress-box {
    width: 90%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 8px;

    .title-name {
      width: 100%;
      margin: 0;
      font-size: 14px;
      font-weight: 900;
      color: var(--gray-1000);
    }

    .progress-bar {
      width: 100%;
      height: 12px;
      border-radius: 16px;
      background-color: var(--gray-50);
      border: 1px solid var(--gray-300);
      display: flex;
      .gauge {
        background-color: var(--primary-400);
        height: 100%;
        transition: 0.2s ease all;
      }
    }

    .message {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      & > p {
        font-size: 12px;
        color: var(--gray-700);
        margin: 0;
      }
      & > span {
        font-size: 10px;
        color: var(--gray-400);
      }
    }
  }
`;
