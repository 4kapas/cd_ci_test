import React from "react";

//login style
import { HiddenCheckbox, CustomCheckbox, CheckboxContainer } from "./style";

//onClick 함수 : onChange(!checked)는 체크박스의 checked를 반대로 토글
export const LoginCheckbox = ({ label, checked, onChange }) => {
  const handleToggle = () => {
    onChange(!checked); // Toggle the state based on the current 'checked' value
  };
  return (
    <CheckboxContainer>
      <HiddenCheckbox
        checked={checked}
        onClick={() => handleToggle(!checked)}
      />
      <CustomCheckbox
        className={checked ? "checked" : ""}
        onClick={() => handleToggle(!checked)}
      />
      {label && <span>{label}</span>}
    </CheckboxContainer>
  );
};
