import styled from "styled-components";

//로그인 아이디 기억하기 체크박스
export const FooterWrap = styled.footer`
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: #f3f4f7;
  border-top: 1px solid #dadde7;
  .main-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    font-family: "Pretendard";
    color: #2f3237;
    margin-bottom: 0;
    padding: 0 28px;
  }
  ul {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    padding-left: 0;
    li {
      list-style: none;
      font-family: "Pretendard";
      font-size: 14px;
      font-weight: 400;
      line-height: 19.6px;
      letter-spacing: -1px;
      color: #727a86;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;
