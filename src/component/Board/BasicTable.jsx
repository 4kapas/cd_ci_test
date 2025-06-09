import React from "react";
import dayjs from "dayjs";

//style
import { StyledBasicTable } from "./style";

//component
import { Pagination } from "@/component/Board";

export const BasicTable = () => {
  // 랜덤 날짜 시간
  const getRandomDate = () => {
    const randomDays = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    return dayjs()
      .subtract(randomDays, "day")
      .subtract(randomHours, "hour")
      .format("YYYY-MM-DD HH:mm");
  };
  // 랜덤 인천 주소
  const getRandomAddress = () => {
    const gu = ["중구", "동구", "서구", "남동구", "서구"];
    const streets = ["인중로", "제물량로", "참외전로", "재능로"];
    const buildingNumbers = ["146", "102", "58", "33"];

    const randomGu = gu[Math.floor(Math.random() * gu.length)];
    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    const randomBuildingNumber =
      buildingNumbers[Math.floor(Math.random() * buildingNumbers.length)];
    const randomDetail = `(${Math.floor(Math.random() * 500 + 1)}-${Math.floor(
      Math.random() * 20 + 1
    )})`;

    return `인천광역시 ${randomGu} ${randomStreet} ${randomBuildingNumber} ${randomDetail}`;
  };

  // 임의 데이터

  const generateDummyData = (length) => {
    return Array.from({ length }).map((_, index) => ({
      no: index + 1,
      account: "dev@gmail.com",
      name: "김지호",
      addr: getRandomAddress(),
      regist: getRandomDate(),
      answer: getRandomDate(),
      admin: "관리자",
    }));
  };

  const dummyData = generateDummyData(20);

  const paginationData = [...Array(7).keys()].map((i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));
  const Number = ({ data }) => <div style={{ padding: "1rem" }}>{data.id}</div>;

  return (
    <>
      <StyledBasicTable>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>사업지구</th>
              <th>민원인</th>
              <th>휴대폰번호</th>
              <th>제목</th>
              <th>주소</th>
              <th>상태</th>
              <th>등록일시</th>
              <th>답변일시</th>
              <th>담당자</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((data) => (
              <tr key={data.no}>
                <td>{data.no}</td>
                <td>{data.account}</td>
                <td>{data.name}</td>
                <td>{data.addr}</td>
                <td>{data.regist}</td>
                <td>{data.answer}</td>
                <td>{data.admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StyledBasicTable>
      <Pagination
        data={paginationData}
        RenderComponent={Number}
        title="Pagination"
        pageLimit={5}
        dataLimit={10}
      />
    </>
  );
};
