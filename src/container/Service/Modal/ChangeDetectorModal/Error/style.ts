import styled from "styled-components";

export const StyledChangeDetectorError = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  .area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
    margin: 0;
    & > p {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      color: var(--gray-1000);
    }
    & > span {
      font-size: 12px;
      color: var(--gray-600);
    }
  }
  .footer {
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
    }
  }
`;
