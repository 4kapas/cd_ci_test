import styled from "styled-components";

export const StyledCommonSelect = styled.div`
  height: 50px;
  border-radius: 4px;
  background-color: #057684;
  overflow: hidden;

  .MuiSelect-select {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.5px;
    min-height: auto;
  }
`;

export const StyledCustomSelect = styled.div`
  height: 28px;
  border-radius: 4px;
  background-color: #fff;
  /* overflow: hidden; */
  width: 100%;
  height: 28px;
  ul {
    display: flex;
    padding: 0;
    height: inherit;
    border-radius: 2px;
    overflow: hidden;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      list-style: none;
      flex: 1;
      height: inherit;
      border: 1px solid #dfe2e7;
      border-right: none;
      cursor: pointer;
      &.active {
        background: #00a991;
        span {
          color: #fff;
        }
      }
      &:last-child:not(span) {
        border-right: 1px solid #dfe2e7;
      }
      > span {
        font-size: 12px;
        letter-spacing: -1px;
        font-weight: 600;
        color: #8992a1;
        display: inline-block;
      }
    }
  }
`;
