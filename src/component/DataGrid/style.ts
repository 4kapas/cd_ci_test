import styled from "styled-components";

export const StyledGridList = styled.div`
  width: 100%;
  height: 100%;
  .MuiDataGrid-root {
    font-family: "Pretendard";
    font-size: 16px;
    border: 1px solid #e0e3eb;
    background-color: #f9f9fb;

    .MuiDataGrid-columnHeaders {
      .MuiDataGrid-row--borderBottom {
        background-color: #f3f4f7;
        .MuiDataGrid-columnHeader {
          border-bottom: 1px solid #e0e3eb;
          padding: 0 16px;
          .MuiDataGrid-columnHeaderTitle {
            height: max-content;
            font-size: 16px;
            font-weight: 700;
            color: #2f3237;
          }
        }
      }
    }
    .MuiDataGrid-row {
      background-color: var(--white);
      padding: 8px 0;
      border-bottom: 1px solid #e0e3eb;
      cursor: pointer;
      &:hover {
        background-color: #bef6ee33;
      }
    }
    .MuiDataGrid-cell {
      font-size: 16px;
      color: var(--gray-800);
      padding: 0 16px;
      height: 100%;
      line-height: 22px;
      border-top: none;
      color: #2f3237;
      border-right: 1px solid #e0e3eb;
      &.last-column-cell {
        border: none;
      }
    }

    .MuiDataGrid-cell:focus,
    .MuiDataGrid-cell:focus-within,
    .MuiDataGrid-columnHeader:focus,
    .MuiDataGrid-columnHeader:focus-within {
      outline: none !important;
    }

    .MuiDataGrid-filler > div {
      border: none;
    }

    .MuiDataGrid-overlay {
      color: #646568;
      font-size: 16px;
    }
  }
`;
