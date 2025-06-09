// import { TextField } from "@/component/Inputs/TextField";
import {
  CategoryDataType,
  ExcuteChangeDetectionFormType,
  DatasetListType,
} from "@/apis/Service/service.thunk";
import { StyledChangeDetectorStep2 } from "./style";
import { ChangeEvent, useEffect, useState } from "react";
import { AlertModal } from "@/component";

interface ChangeDetectorStep2Props {
  categoryList: CategoryDataType[];
  serviceList: DatasetListType[];
  requestBody: ExcuteChangeDetectionFormType;
  handleRequestBody: (form: Partial<ExcuteChangeDetectionFormType>) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

export const ChangeDetectorStep2 = ({
  categoryList,
  serviceList,
  requestBody,
  handleRequestBody,
  handlePrev,
  handleNext,
}: ChangeDetectorStep2Props) => {
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleActiveButton = () => {
    if (isActive) setIsOpen(true);
  };

  const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
    handleRequestBody({ description: e.target.value });
  };

  const handleThreshold = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 10) {
      handleRequestBody({ threshold: value.toString() });
    }
  };

  useEffect(() => {
    setIsActive(requestBody.threshold !== "");
  }, [requestBody]);

  return (
    <StyledChangeDetectorStep2>
      <div className="body">
        <div className="field">
          <div className="label">기준 las</div>
          <div className="value">{requestBody.baseID}</div>
        </div>
        <div className="field">
          <div className="label">비교 las</div>
          <div className="value">{requestBody.targetID}</div>
        </div>
        <div className="field required">
          <div className="label">임계값 (M)</div>
          <div className="value">
            <input
              type="number"
              placeholder="임계값을 입력하세요."
              value={requestBody.threshold}
              min={0}
              max={100}
              onChange={handleThreshold}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">설명</div>
          <div className="value">
            <input
              type="text"
              placeholder="설명을 입력하세요."
              value={requestBody.description}
              onChange={handleDescription}
            />
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="message">
          <p>{message}</p>
        </div>{" "}
        <button className="prev" onClick={handlePrev}>
          이전
        </button>
        <button disabled={!isActive} onClick={handleActiveButton}>
          실행
        </button>
      </div>
      <AlertModal
        title="실행"
        open={isOpen}
        setOpen={setIsOpen}
        handleConfirm={handleNext}
        type="confirm"
      >
        <p>변화탐지를 실행하겠습니까?</p>
      </AlertModal>
    </StyledChangeDetectorStep2>
  );
};
