import styled from "styled-components";

export const StyledNav = styled.header`
  width: 100%;
  height: 50px;

  .main-navBar {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    padding: 8px;
    padding-bottom: 0;
    border-bottom: 1px solid #dfe2e7;
    box-sizing: border-box;
    height: 50px;

    .logo {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 0 12px;
      height: 42px;
      & > img {
        width: 113px;
        height: 24px;
        display: inline-block;
        margin-left: auto;
      }
    }
    .tab-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      //홈,분석,업무연계 버튼
      .gnbTab {
        /* width: 40px; */
        padding: 8px 16px;
        color: #646568;
        font-size: 18px;
        font-weight: 300;
        box-sizing: content-box;
        display: inline-block;
        border-bottom: 2px solid transparent;
        margin: 0;
        height: 44px;
        position: relative;
        bottom: -1px;
        box-sizing: border-box;

        &.active {
          border-bottom: 2px solid #00a38b;
          color: #00a38b;
          font-weight: 900;
        }
      }
    }
    &.border-none {
      border-bottom: none !important;
    }
  }
`;
