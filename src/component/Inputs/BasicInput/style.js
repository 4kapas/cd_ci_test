import styled from "styled-components";

export const StyledBasicInput = styled.div`
  margin-top: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  &:hover:not(.Mui-disabled):before {
    border-bottom: none !important;
  }
`;

export const StyledAlertText = styled.p`
  position: absolute;
  top: 9px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.5px;
  img {
    display: inline-flex;
    width: 12px;
    margin-right: 6px;
  }
`;
