import useModalStore from "@/store/useModalStore";
import { SocketLogType } from "..";
import { StyledChangeDetectorError } from "./style";

interface ChangeDetectorErrorProps {
  message: string;
}

export const ChangeDetectorError = ({ message }: ChangeDetectorErrorProps) => {
  const { setShowChangeDetector } = useModalStore();
  return (
    <StyledChangeDetectorError>
      <div className="area">
        <p>오류가 발생했습니다.</p>
        <span>{message}</span>
      </div>
      <div className="footer">
        <button onClick={() => setShowChangeDetector(false)}>닫기</button>
      </div>
    </StyledChangeDetectorError>
  );
};
