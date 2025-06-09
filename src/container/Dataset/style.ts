import styled from "styled-components";

export const StyleHomeWrap = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  padding: 16px 24px 24px 24px;
`;
export const StyleGridWrap = styled.div`
  box-sizing: border-box;
  height: calc(100% - 56px);
`;
//타이틀
export const StyledHomeTitle = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  gap: 32px;
  .area {
    width: max-content;
    margin: 0;
    display: flex;
    gap: 16px;
    flex-flow: row nowrap;
    align-items: center;
    &.fill {
      flex: 1;
    }
    & > .line {
      display: block;
      width: 1px;
      height: 16px;
      border: 16px;
      background-color: #e0e3eb;
    }
    & > .box {
      display: flex;
      gap: 8px;
      & > .label {
        margin: 0;
        font-size: 16px;
        line-height: 24px;
        color: #2f3237;
      }
      & > span {
        background-color: #e0e3eb;
        padding: 0 4px;
        border-radius: 4px;
      }
      & > button {
        box-sizing: border-box;
        padding: 0;
        width: 40px;
        height: 40px;
        margin: 0;
        background-color: var(--primary-300);
        font-size: 10px;
        border-radius: 6px;
        color: var(--white);
        &:hover {
          background-color: var(--primary-500);
        }
      }
    }
  }
`;
