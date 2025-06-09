import styled from "styled-components";

//image
import { commonImage } from "@/consts/image";

//체크박스 이미지 on,off 이미지
export const checkboxImages = {
  off: commonImage.checkboxOff,
  on: commonImage.checkboxOn,
};

//로그인 아이디 기억하기 체크박스
export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  /* display: none; */
  opacity: 0;
  position: absolute;
  left: 0;
  z-index: 999;
`;
export const CustomCheckbox = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url(${checkboxImages.off});
  background-position: center center;
  background-size: cover;
  cursor: pointer;

  // 체크 On
  &.checked {
    background: url(${checkboxImages.on});
  }
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  // label 안의 span 텍스트
  > span:last-child {
    display: inline-block;
    margin-left: 8px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.15px;
  }
`;
