//mui
import Box from "@mui/material/Box";

//style
import { StyledBoardLabel } from "./style";
import { useEffect, useState } from "react";

export const BoardLabel = ({ data, onClick, selectedValue = "" }) => {
  const [active, setActive] = useState(selectedValue);

  const {
    answerStateNotCount,
    answerStateOkCount,
    answerStateWaitingCount,
    finishStateOkCount,
    totalCount,
    historyCount,
  } = data?.resultObject || [];

  const labels = [
    { label: "전체", ariaLabel: "", count: totalCount },
    { label: "신규", ariaLabel: "NOT", count: answerStateNotCount },
    { label: "답변완료", ariaLabel: "OK", count: answerStateOkCount },
    { label: "미답변", ariaLabel: "WAITING", count: answerStateWaitingCount },
    {
      label: "종료된 민원",
      ariaLabel: "FINISH",
      count: finishStateOkCount,
      width: "170px",
    },
    { label: "히스토리", ariaLabel: "HISTORY", count: historyCount },
  ];

  const handleLabel = (e, newValue) => {
    e.stopPropagation();

    onClick(newValue);
    setActive(newValue);
  };
  useEffect(() => {
    setActive(selectedValue);
  }, [selectedValue]);

  return (
    <StyledBoardLabel>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {labels.map(({ label, ariaLabel, count, width }, index) => (
          <div
            key={index}
            className={`label ${active === ariaLabel ? "active" : ""}`}
            style={{ width }}
            aria-label={ariaLabel}
            onClickCapture={(e) => handleLabel(e, ariaLabel)}
          >
            <span>{label}</span>
            <span>{count}</span>
          </div>
        ))}
      </Box>
    </StyledBoardLabel>
  );
};
