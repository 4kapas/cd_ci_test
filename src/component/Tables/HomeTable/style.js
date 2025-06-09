import styled from "@emotion/styled";

export const StyledHomeTable = styled.div`
 position: relative;
 border-top: 2px #98A2B3 solid;
 min-height: 520px;
 z-index: 0;
 
  //Table Header
  .MuiTableCell-head {
    height: 46px;
    padding: 5px 0;
    color: #222222;
    font-size: 16px;
    font-weight: 500;
    line-height: 18px;
    text-align: center;
    background-color: #F5F6F7;
  }

  .MuiTableRow-root {
    > td {
      white-space: break-spaces;
    }
  }

  //Table Body
  .MuiTableCell-body {
    height: 46px;
    padding: 5px 0;
    color: #2F3237;
    font-size: 16px;
    font-family: Pretendard;
    font-weight: 400;
    line-height: 22.40px;
    word-wrap: break-word;
    text-align: center !important;
  }

  .MuiTablePagination-root {
    border-bottom: none;
    padding: 0 !important;

    .MuiTablePagination-toolbar {
      padding: 0 !important;

      .MuiInputBase-root {
        margin-right: 0 !important;
        border-radius: 2px !important;
        border: 1px solid #dadada;
      }
    }
  }

  .MuiTablePagination-displayedRows {
    display: none;
  }

  .MuiTablePagination-actions {
    display: none;
  }
`;

export const StyledPagination = styled.div`
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
 

  &.absolute-bottom {
    position: absolute;
    bottom: 50px;
    right: 10px;
  }

  .MuiTablePagination-input {
    margin-left: 12px;
    padding: 0;
    .MuiTablePagination-select {
      padding: 6px 30px 6px 16px;
    }
  }
  .MuiPaginationItem-text{
    color: #2F3237;
    font-size: 14px;
    font-weight: 400;
  }
  .MuiPaginationItem-text.Mui-selected {
    height: 32px;
    font-size: 14px;
    font-weight: 500;
  }
  .MuiPaginationItem-icon{
    width: 18px;
    height: 18px;
  }
`;
