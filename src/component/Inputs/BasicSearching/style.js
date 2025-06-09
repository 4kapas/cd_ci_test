import styled from "styled-components";

export const StyledBasicSearching = styled.div`
  margin-left: auto;
  .MuiInputBase-input {
    font-family: "Pretendard";
    width: 200px;
    color: #000000;
    font-size: 15px;
    font-weight: 400;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    display: inline-block !important;
    &::placeholder {
      color: #8992a1 !important;
      font-weight: 400 !important;
      font-size: 14px !important;
    }
    &:disabled {
      /* border: 1px solid #f0f1f4 !important; */
      color: #8992a1 !important;
    }
  }
  /* .serchTextField {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  } */
`;
