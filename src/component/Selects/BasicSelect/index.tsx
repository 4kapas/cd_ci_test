import { useState } from "react";
//mui
import {
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
//style
import { StyledBasicSelect } from "./style";
import { OptionType } from "@/types";

interface BasicSelect {
  label?: string;
  options: OptionType[];
  defaultValue?: string;
  placeholder?: string;
  width?: string;
  className?: string;
  optionClassName?: string;
  handleValue?: (value: string) => void;
  onChange?: (e: SelectChangeEvent<string>) => void;
}

export const BasicSelect = ({
  label,
  options,
  defaultValue,
  placeholder = "",
  width = "100%",
  className,
  optionClassName = "",
  onChange,
  handleValue,
}: BasicSelect) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "default");
  const [isOpen, setIsOpen] = useState(false); // 메뉴 열림 상태 관리

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    onChange?.(e);
    handleValue?.(e.target.value);
    setSelectedValue(e.target.value);
  };

  return (
    <StyledBasicSelect className={className} $width={width}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={selectedValue}
        label={label}
        onChange={handleSelectChange}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        className={isOpen ? "select" : undefined} // ✅ 드롭다운 열릴 때 class 추가
        startAdornment={
          selectedValue === "default" && (
            <InputAdornment position="start" className="placeholder">
              {placeholder}
            </InputAdornment>
          )
        }
      >
        {options?.map((option, index) => (
          <MenuItem
            className={optionClassName}
            key={index}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </StyledBasicSelect>
  );
};
