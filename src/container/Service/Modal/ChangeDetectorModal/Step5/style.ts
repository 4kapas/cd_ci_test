import styled from "styled-components";

export const StyledChangeDetectorStep5 = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  .area {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    & > p {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      color: var(--gray-1000);
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
      box-sizing: border-box;
      padding: 0 16px;
      height: 36px;
      margin: 0;
      background-color: var(--primary-300);
      min-width: 80px;
      width: max-content !important;
      &:first-child {
        background-color: var(--white);
        color: var(--gray-900);
        border: 1px solid var(--gray-300);
      }
    }
  }
`;
