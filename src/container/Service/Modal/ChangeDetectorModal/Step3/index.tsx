import { ExcuteChangeDetectionFormType } from "@/apis/Service/service.thunk";
import { useEffect } from "react";
import { SocketLogType } from "..";
import { StyledChangeDetectorStep3 } from "./style";

interface ChangeDetectorStep3Props {
  requestBody: ExcuteChangeDetectionFormType;
  socketLog: SocketLogType | null;
  handleNext: () => void;
  handleLoading: (isLoading: boolean) => void;
  excuteChangeDetection: () => void;
}

export const ChangeDetectorStep3 = ({
  requestBody,
  socketLog,
  handleNext,
  handleLoading,
  excuteChangeDetection,
}: ChangeDetectorStep3Props) => {
  const init = () => {
    excuteChangeDetection();
    handleLoading(true);
  };

  const handleLog = (log: SocketLogType) => {
    if (log.source === "python" && log.progress === 100 && log.status === 2) {
      handleNext();
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (socketLog) handleLog(socketLog);
  }, [socketLog]);

  return (
    <StyledChangeDetectorStep3>
      <div className="progress-box">
        <p className="title-name">변화 탐지 실행</p>
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
            <p>변화 탐지 준비중...</p>
          )}
        </div>
      </div>
    </StyledChangeDetectorStep3>
  );
};
