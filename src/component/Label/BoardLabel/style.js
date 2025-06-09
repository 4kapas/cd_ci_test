import { styled } from "styled-components";

export const StyledBoardLabel = styled.div`
  margin:16px 0;
    
  .label{
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 146px;
    padding:9px 20px;
    color:#1D2939;
    font-size: 16px;
    font-weight: 500;
    border:1px solid #DFE2E7;

    &:not(:last-child) {
      border-right: unset;
      }

    &.active{
      background: #F0F1F4;
      color: #007A68;
      word-wrap: break-word
    }
  }
`;
