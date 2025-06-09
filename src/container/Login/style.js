import styled from "styled-components";

// Login 공통 CSS Property
const commonTextStyle = `
  color:#ffffff;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.5px;
`;

//Login style 로그인 페이지
export const StyledLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(108deg, #1e9a85 17.48%, #1c6aac 100%);

  //form 담고있는 container 영역
  .loginContainer {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding: 0;
  }

  //form 로그인 비밀번호
  .loginForm {
    font-size: 14px;
    h1.logo {
      padding-bottom: 32px;
      margin-bottom: 32px;
      box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.25);
      border-bottom: 1px #197485 solid;

      img {
        width: 100%;
        height: 34px;
      }
    }
    .MuiInputLabel-shrink {
      transform: none !important;
      transition: none !important;
      font-size: 0 !important;
    }
    .MuiSelect-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
      color: white;
    }
  }

  // 로그인 페이지 공통 input,select 속성
  input,
  select {
    border-radius: 4px;
    background-color: #057684;
    ${commonTextStyle}
  }
  input[type="text"],
  input[type="password"] {
    width: 100% !important;
    height: 16px;
    padding: 17px 14px;
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

// 로그인 페이지에서만 쓰이는 Input Style
export const StyledLoginInput = styled`
  border:1px solid rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
  &:hover:not(.Mui-disabled):before{
    border-bottom:none!important;
  }
`;

// 로그인 페이지에서만 쓰이는 Select Style
export const StyledLoginSelect = styled.div`
  height: 50px;
  border-radius: 4px;
  background-color: #057684;
  overflow: hidden;
  .MuiSelect-select {
    display: flex;
    align-items: center;
    ${commonTextStyle}
    &.MuiSelect-select {
      height: 16px;
      min-height: auto;
      padding: 17px 38px 17px 14px !important;
    }
  }
`;

//로그인 실패시 안내 문구
export const StyledLoginComment = styled.p`
  position: absolute;
  top: 50%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transform: translateY(-50%);
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

//로그인 버튼
export const StyledLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 49px;
  margin-bottom: 32px;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  background-color: #31c1b7;
  &:disabled {
    color: #00362e;
    background-color: rgba(0, 0, 0, 0.18);
    cursor: default;
  }
`;
