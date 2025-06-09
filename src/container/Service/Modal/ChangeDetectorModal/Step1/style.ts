import styled from "styled-components";

export const StyledChangeDetectorStep1 = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  gap: 16px;
  * {
    font-family: "Pretendard" !important;
  }
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    gap: 4px;
    .table-container {
      thead th {
        white-space: nowrap;
        border: 1px solid var(--gray-300);
        border-left: none;
        background-color: var(--gray-50);
        padding: 4px 16px;
        height: max-content;
        font-size: 12px;
        font-weight: 700;
        color: var(--gray-1000);
        &:first-child {
          border-left: 1px solid var(--gray-300);
        }
      }

      tbody {
        tr {
          cursor: pointer;
          td {
            white-space: nowrap;
            border-right: 1px solid var(--gray-300);
            border-bottom: 1px solid var(--gray-300);
            padding: 4px 16px;
            height: max-content;
            font-size: 12px;
            color: var(--gray-1000);
            color: var(--gray-400);
            &:first-child {
              border-left: 1px solid var(--gray-300);
            }
          }
          &.highlight-region td {
            color: var(--secondary-600);
          }
          &:hover td {
            background-color: var(--gray-100);
          }
          &.selected td {
            background-color: var(--secondary-100);
            color: var(--secondary-600);
            font-weight: 900;
          }
        }
      }
    }
  }
  .footer {
    margin-top: auto;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    .message > p {
      margin: 0;
      font-size: 10px;
      color: var(--state-error);
    }
    & > button {
      height: 36px;
      margin: 0;
      background-color: var(--primary-300);
      &:disabled {
        background-color: var(--gray-300);
        cursor: default;
      }
    }
  }
`;
