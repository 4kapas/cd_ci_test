import styled from "styled-components";

interface StyledBasicSelectProps {
  $width: string;
}

export const StyledBasicSelect = styled.div<StyledBasicSelectProps>`
  width: ${({ $width }) => $width};
  box-sizing: border-box;
  .MuiInputBase-root {
    height: 40px !important;
    box-sizing: border-box;
    background-color: #fff;
    font-size: 16px;
    color: #2f3237;
    border: 1px solid #e0e3eb;
    border-radius: 6px;
    .MuiSelect-select {
      padding: 8px 8px 8px 12px;
    }
    & > svg {
      width: 20px;
      height: 20px;
      right: 8px !important;
      top: 50%;
      transform: translateY(-50%);
    }
    &.select {
      border: 1px solid #00a991;
    }
  }
`;
