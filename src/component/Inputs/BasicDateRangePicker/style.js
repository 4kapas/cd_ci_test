import styled from "styled-components";

export const StyledBasicDateRangePicker = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0;

  .during {
    margin: 0 8px;
  }

  .react-datepicker-wrapper {
    width: 172px;
    height: 100%;
  }
  .datePickerWrapper {
    position: relative;
    width: 172px;
    border-color: #dadada;
    border-radius: 6px;

    //달력아이콘
    /* .icon {
      position: absolute;
      top: 50%;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-top: -12px;
      cursor: pointer;
    } */
  }
  .datepicker {
    width: 100%;
    height: 40px;
    padding: 3px 13px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    border: 1px solid #dee3e8;
    background: #ffffff;
    color: #35393f;
    cursor: pointer;
    outline-color: #00a991;
  }
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background-color: #98a2b3;
    border-radius: 100%;
  }
  .react-datepicker__month-container {
    width: 240px;
  }
  .react-datepicker__header {
    background-color: #ffffff;
  }
  .react-datepicker__navigation {
    top: 0;
    padding: 0;
  }
  .react-datepicker__year-read-view--down-arrow,
  .react-datepicker__month-read-view--down-arrow,
  .react-datepicker__month-year-read-view--down-arrow,
  .react-datepicker__navigation-icon::before {
    border-color: #7a828f;
    border-width: 1.5px 1.5px 0 0;
    width: 7px;
    height: 7px;
  }
  .react-datepicker__navigation-icon--next::before {
    left: 20px;
  }
  .react-datepicker__navigation-icon::before {
    right: 34px;
  }
  .react-datepicker__navigation--previous {
    left: 19px;
  }
  .react-datepicker__navigation--next {
    right: 19px;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    color: black;
    font-size: 16px;
    font-weight: 500;
    word-wrap: break-word;
  }
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    padding: 3px;
    font-size: 14px;
    font-weight: 400;
    line-height: inherit;
    width: 27px;
    height: 27px;
  }
  .react-datepicker__day.previous-month-date {
    color: #727a86;
  }
  .react-datepicker__day--selected {
    border-radius: 100%;
    background-color: #00a991;
  }
  .react-datepicker__triangle::before,
  .react-datepicker__triangle::after {
    opacity: 0;
  }
  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    border-radius: 100%;
  }
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: #00a991;
    border-radius: 100%;
    color: #ffffff;
  }
  .react-datepicker__input-container {
    .react-datepicker__calendar-icon {
      padding: 0;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;
    }
  }
`;
