import { commonImage } from "@/consts/image";
import { StyledLoadingBar } from "./style";
import useLoadingStore from "@/store/useLoadingStore";

export const LoadingBar = () => {
  const { loadingCount, loadingMessage } = useLoadingStore();

  if (!loadingCount) return null;
  return (
    <StyledLoadingBar>
      <div className="content">
        <div className="loading-image-wrap">
          <img src={commonImage.loadingImages} alt="로딩아이콘" />
        </div>
        {loadingMessage && <p>{loadingMessage}</p>}

        {/* <div className="progress-bar-wrap">
          <div className="progresing-bar"></div>
        </div> */}
      </div>
    </StyledLoadingBar>
  );
};
