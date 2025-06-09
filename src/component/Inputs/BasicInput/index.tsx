//@ts-nocheck
// eslint-disable
import { useState, useEffect } from "react";
//mui
import { Box, Input, InputLabel } from "@mui/material";
// styled
import { StyledBasicInput, StyledAlertText } from "./style";
//image
import { commonImage } from "@/consts/image.ts";

export const BasicInput = ({
  value,
  type = "text",
  label,
  required = false,
  placeholder,
  onChange,
  className,
  handleSearch,
  ...props
}: any) => {
  const [error, setError] = useState(false);
  const [alertText, setAlertText] = useState("");

  // 유효성 검사
  useEffect(() => {
    if (type === "password" && value) {
      // TODO: 비밀번호 최소 자리수 추후 수정 필요 (23.09.06 진아름)
      if (value.length < 4) {
        setError(true);
        // setAlertText("비밀번호는 최소 4자리 이상이어야 합니다.");
      } else {
        setError(false);
        setAlertText("");
      }
    }

    if (type === "id" && value) {
      // TODO : ID에 대한 간단한 유효성 검사를 임의로 추가 추후 수정 필요 (23.09.06 진아름)
      const regex = /^[a-zA-Z0-9_]+$/;

      if (!regex.test(value)) {
        setError(true);
        // setAlertText("아이디는 알파벳, 숫자 사용할 수 있습니다.");
      } else {
        setError(false);
        setAlertText("");
      }
    }
  }, [value, type]);

  return (
    <StyledBasicInput className={className}>
      {label && (
        <InputLabel htmlFor={type} shrink>
          {label}
        </InputLabel>
      )}
      <Input
        required={required}
        id={type}
        value={value}
        type={type === "password" ? "password" : "text"}
        autoFocus={type !== "password"}
        placeholder={placeholder}
        onChange={onChange}
        inputProps={{
          onKeyDown: (e) => {
            console.log(handleSearch, "handleSearch");
            if (e.key === "Enter" && handleSearch) {
              handleSearch(); // 엔터 키가 눌렸을 때 handleSearch 함수 실행
            }
          },
        }}
        {...props}
      />
      <Box sx={{ position: "relative" }}>
        {alertText && (
          <StyledAlertText>
            <img src={commonImage.loginNotice} alt="불일치" />
            {alertText}
          </StyledAlertText>
        )}
      </Box>
    </StyledBasicInput>
  );
};
