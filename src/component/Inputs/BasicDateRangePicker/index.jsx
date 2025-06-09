//datepicker
import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//dayjs
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ko } from "date-fns/esm/locale";

//style
import { StyledBasicDateRangePicker } from "./style";

//image
import { commonImage } from "@/consts/image.ts";

//시간
dayjs.extend(utc);
dayjs.extend(timezone);

export const BasicDateRangePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sendValue,
  width,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  //  커스텀 달력 인풋
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="react-custom-input-wraps"
      style={{
        width: "100%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
        height: "40px",
        border: "1px solid #dfe2e7",
        borderRadius: "2px",
      }}
    >
      {value}
      <img
        src={commonImage.calender}
        style={{ marginLeft: "auto", paddingRight: "10px" }}
        alt="캘린더 아이콘"
      />
    </div>
  ));

  const handleDayClassName = (date) => {
    // 날짜가 현재 보이는 달과 다른 달에 속한 경우만 스타일 적용
    if (date.getMonth() !== currentMonth) {
      return "previous-month-date";
    }
    return "";
  };

  const formatDateToString = (date) => {
    return dayjs(date).format("yyyy-MM-dd");
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);

    if (!sendValue) return;
    if (date) {
      const newDate = formatDateToString(date);
      sendValue("startDate", newDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (!sendValue) return;
    if (date) {
      const newDate = formatDateToString(date);
      sendValue("endDate", newDate);
    }
  };

  return (
    <StyledBasicDateRangePicker>
      <div className="datePickerWrapper">
        <DatePicker
          customInput={<CustomInput />}
          width={width}
          className="datepicker"
          selectsStart
          selected={startDate}
          startDate={startDate}
          dateFormat="yyyy.MM.dd"
          onSelect={handleStartDateChange}
          onChange={handleStartDateChange}
          onMonthChange={(date) => setCurrentMonth(date.getMonth())}
          locale={ko}
          dayClassName={handleDayClassName}
          // showMonthYearPicker
        />
      </div>
      <span className="during">-</span>
      <div className="datePickerWrapper">
        <DatePicker
          customInput={<CustomInput />}
          width={width}
          className="datepicker"
          selectsEnd
          selected={endDate}
          endDate={endDate}
          dateFormat="yyyy.MM.dd"
          onSelect={handleEndDateChange}
          onChange={handleEndDateChange}
          onMonthChange={(date) => setCurrentMonth(date.getMonth())}
          locale={ko}
          dayClassName={handleDayClassName}
        />
      </div>
    </StyledBasicDateRangePicker>
  );
};
