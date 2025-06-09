import useModalStore from "@/store/useModalStore";
import { DatasetType } from "@/types";
import { useEffect } from "react";
import { StyledChangeDetectorStep5 } from "./style";

interface ChangeDetectorStep5Props {
  detectResultInfo?: DatasetType;
  handleSuccess: (isSuccess: boolean) => void;
}

export const ChangeDetectorStep5 = ({
  detectResultInfo,
  handleSuccess,
}: ChangeDetectorStep5Props) => {
  const { setShowChangeDetector, setShowReportExport } = useModalStore();

  const handleCreateReport = () => {
    if (detectResultInfo?.changeDetect) {
      const { changeDetect } = detectResultInfo;
      const { target, base } = changeDetect;
      setShowReportExport(true, {
        filename: `${base.acqDate}_${
          target.acqDate
        }_${detectResultInfo.address.replaceAll(" ", "_")}_변화탐지보고서`,
        datasetInfo: detectResultInfo,
      });
    }
  };

  const handleClose = () => {
    setShowChangeDetector(false);
  };

  const handleMove = () => {
    window.location.href = `/#/service/${detectResultInfo?.id}`;
    window.location.reload();
  };

  useEffect(() => {
    handleSuccess(true);
  }, []);

  return (
    <StyledChangeDetectorStep5>
      <div className="area">
        <p>변화탐지가 완료되었습니다.</p>
      </div>
      <div className="footer">
        <button onClick={handleClose}>닫기</button>
        <button onClick={handleMove}>이동</button>
        <button onClick={handleCreateReport}>보고서 생성</button>
      </div>
    </StyledChangeDetectorStep5>
  );
};
