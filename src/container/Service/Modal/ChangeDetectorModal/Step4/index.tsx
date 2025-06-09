import { useEffect } from "react";
import { SocketLogType } from "..";
import { StyledChangeDetectorStep3 } from "../Step3/style";
import { DatasetType } from "@/types";

interface ChangeDetectorStep4Props {
  socketLog: SocketLogType | null;
  detectResultInfo?: DatasetType;
  handleNext: () => void;
  handleLoading: (isLoading: boolean) => void;
}

export const ChangeDetectorStep4 = ({
  socketLog,
  detectResultInfo,
  handleNext,
  handleLoading,
}: ChangeDetectorStep4Props) => {
  const handleLog = (log: SocketLogType) => {
    if (
      (log.source === "potree" && log.progress === 100 && log.status === 2) ||
      detectResultInfo
    ) {
      handleNext();
    }
  };

  useEffect(() => {
    handleLoading(true);
    return () => {
      handleLoading(false);
    };
  }, []);

  useEffect(() => {
    if (socketLog) handleLog(socketLog);
  }, [socketLog, detectResultInfo]);

  return (
    <StyledChangeDetectorStep3>
      <div className="progress-box">
        <p className="title-name">3D 변환 처리</p>
        <div className="progress-bar">
          <span
            style={{
              width: socketLog ? socketLog.progress + "%" : "0%",
            }}
            className="gauge"
          />
        </div>
        <div className="message">
          {socketLog ? (
            <>
              <p>{socketLog.message}</p>
              <span>{socketLog.progress}%</span>
            </>
          ) : (
            <p>3D 변환 준비중...</p>
          )}
        </div>
      </div>
    </StyledChangeDetectorStep3>
  );
};
