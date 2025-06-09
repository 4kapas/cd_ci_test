import styled from "styled-components";

export const StyledBasicTable = styled.div`
  border-top: 1px solid #98a2b3;
  border-bottom: 1px solid #98a2b3;
  background-color: #ffffff;

  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead,
  tbody {
    //display: block;
    display: flex;
    flex-direction: column;
  }

  tbody {
    //height: 500px;
    max-height: 80%;
    overflow-y: auto;
  }
  tr {
    display: flex;
  }

  th,
  td {
    padding: 10px;
    color: #000000;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
  }
  th {
    height: 40px;
  }
  td {
    min-height: 40px;
    border-bottom: 1px solid #dee3e8;
    word-break: break-word;
  }

  thead th {
    position: sticky;
    top: 0;
    font-weight: 400;
    background-color: #f2f4f7;
    border-bottom: 1px solid #98a2b3;
    z-index: 1;
  }

  tbody tr:hover {
    background-color: #dee3e8;
  }
  tbody td {
    cursor: pointer;
  }

  //  th,td widhth 임의

  th:nth-child(1),
  td:nth-child(1) {
    width: 60px;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 15%;
  }
  th:nth-child(3),
  td:nth-child(3) {
    width: 80px;
  }
  th:nth-child(4),
  td:nth-child(4) {
    width: calc(100% - 655px);
  }
  th:nth-child(5),
  td:nth-child(5) {
    width: 200px;
  }
  th:nth-child(6),
  td:nth-child(6) {
    width: 200px;
  }
  th:nth-child(7),
  td:nth-child(7) {
    width: 100px;
  }
`;

export const StyledPagination = styled.div`
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;
  }
  .pageButton {
    display: flex;
    align-items: center;
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }
    span {
      color: #475467;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      &:first-of-type {
        margin-right: 8px;
      }
    }
  }
  .numberGroup {
    display: flex;
    align-items: center;
    justify-content: center;
    .paginationItem {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      color: #475467;
      font-size: 14px;
      font-weight: 500;
      background-color: transparent;
      &.active {
        background-color: #ebeef1;
      }
    }
  }
`;

export const DetailWrapper = styled.div``;

export const DetailMetaInfo = styled.div`
  font-size: 16px;
  line-height: 19px;
  color: #2f3237;
  margin-bottom: 14px;

  h1{
    margin-bottom: 0;
    color: #2F3237;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    word-wrap: break-word;
  }

  span {
    font-weight: 600;
    &.detail-meta-info-content {
      display: inline-block;
      margin-bottom: 6px;
    }
  }

  /* 새로 만들기, 조회 */
  .button {
    &.create {
      background: #079db0;
    }
    padding: 10px 20px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    line-height: 18.2px;
    word-wrap: break-word;
    background: #00a991;
    border-radius: 2px;
  }
`;

export const DetailImage = styled.div`
  margin: 24px 0;
  height: 320px;
  min-height: 320px;
  background-color: #ebeef1;

  img {
    max-width: 100%;
    width: 100%;
  }
`;

export const DetailContent = styled.div`
  width: 100%;
  height: 150px;
  margin-bottom: 24px;
  padding: 10px;
  font-size: 16px;
  line-height: 1.2;
  border: 1px solid #1F3237;
  white-space: pre-wrap;
  background-color: #ffffff;
  overflow: hidden;

  textarea {
    width: 100%;
    height: 100%;
    font-size: 16px;
    border: none;
    resize: none;
    background: #ffffff;
  }
`;

export const DetailReplayTextarea = styled.textarea`
  height: 180px;
  padding: 10px;
  font-size: 16px;
  line-height: 1.2;
  border: 1px solid #1F3237;
  resize: none;

  /* 새로 만들기, 조회 */
  .button {
    padding: 10px 20px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    line-height: 18.2px;
    word-wrap: break-word;
    background: #00a991;
    border-radius: 2px;
  }
`;
