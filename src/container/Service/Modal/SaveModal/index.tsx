//libraries
//@ts-nocheck
import { updateLand } from "@/apis/Land/land.api";
import { AlertModal, BasicInput, BasicModal } from "@/component";
import { ROUTE_SERVICE } from "@/routes";
import { COOKIE_SAVE_USER_ID, cookieStorage } from "@/services/cookie";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { StyledCreateResultModal, StyledSaveModalErrorContent } from "./style";

interface Props {
  titles: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  landData?: any;
  saveDatas?: any;
  onSave?: any;
  sideBarRef?: any;
  viewer?: any;
  savedBoardId?: any;
  setSavedBoardId?: any;
  setIsWorldSave?: any;
  jobDetailDatas?: any;
  refetch?: any;
}

export const SaveModal = ({
  open,
  setOpen,
  landData,
  saveDatas,
  titles,
  sideBarRef,
  viewer,
  savedBoardId,
  setSavedBoardId,
  setIsWorldSave,
  jobDetailDatas,
  refetch,
}: Props): JSX.Element | undefined => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [saveTitle, setSaveTitle] = useState(""); // 제목
  const [contents, setContents] = useState(""); //답변

  const [errors, setErrors] = useState({
    title: "",
  });

  const validateTitle = (title) => {
    if (title.trim() === "") {
      setErrors({ title: "제목을 입력해주세요." });
      return false;
    }

    setErrors({ title: "" }); // 에러 메시지 초기화
    return true;
  };
  //민원인 입력 정보(이름, 전화번호, 주소)
  // const [complainant, setComplainant] = useState("");

  const [searchParams] = useSearchParams();
  const queryValue = searchParams.get("boardId");
  // const { data, isLoading } = boardDetailData(queryValue); // 게시글 상세 데이터
  const [opensd, setOpensd] = useState(false);
  // const { mutate: createBoardMutate } = useMutation(createBoard);
  // const { mutate: mutateUpdateBoardAdmin } = useMutation(updateBoardAdmin);
  const { mutate: mutateUpdateLand } = useMutation(updateLand);
  const cookieUserId = cookieStorage.getCookie(COOKIE_SAVE_USER_ID);
  // const cookieUserName = cookieStorage.getCookie(COOKIE_SAVE_USER_NAME);
  // const cookieUserNickname = cookieStorage.getCookie(COOKIE_SAVE_USER_NICKNAME);
  // const cookieUserMobile = cookieStorage.getCookie(COOKIE_SAVE_USER_MOBILE);

  // url
  // const info = data?.resultObject ?? [];

  const handleCreate = async () => {
    if (!cookieUserId) navigate("/login");
    if (!saveTitle) {
      validateTitle(saveTitle);
      return false;
    }
    let saveJson = await sideBarRef.current.getSence(viewer, 1);

    const updatedLandInfoForm = {
      board: queryValue,
      answerTitle: saveTitle,
      answerContents: contents,
      meta: saveJson || "",
    };

    mutateUpdateLand(updatedLandInfoForm, {
      onSuccess: (res) => {
        console.log(res, "res");
        let sortedSaveDatas = jobDetailDatas?.resultObject
          .slice()
          .sort((a: any, b: any) => {
            // 둘 중 하나라도 version이 없는 경우를 처리
            if (a.version == null) return 1;
            if (b.version == null) return -1;

            // 둘 다 version이 있는 경우 내림차순 정렬
            return b.version - a.version;
          });
        console.log(sortedSaveDatas, "sort");
        // 정렬된 배열의 첫 번째 요소의 landInfoId를 가져옴
        const firstLandInfoId =
          sortedSaveDatas.length >= 0 ? sortedSaveDatas[0].landInfoId : null;
        console.log(firstLandInfoId, "firstLandInfoId");
        // firstLandInfoId가 null이 아닌 경우에만 navigate 함수 실행
        if (firstLandInfoId != null || firstLandInfoId == null) {
          navigate(
            `${ROUTE_SERVICE}/${serviceId}?boardId=${queryValue}&landInfoId=${Number(
              firstLandInfoId + 1
            )}`
          );
          setIsWorldSave(true);
          setOpensd(true);
        } else {
          console.log("No valid landInfoId found for navigation.");
        }

        refetch();
      },
    });
  };

  return (
    <>
      <BasicModal
        title={titles}
        open={open}
        setOpen={setOpen}
        width={"850px"}
        height={"auto"}
        className="createHistoryModal"
      >
        <StyledCreateResultModal>
          {/* 저장 하기 제목 */}
          <div className="content">
            <div className="bottom">
              <h3>제목</h3>
              <div>
                <BasicInput
                  className="input mb0"
                  type="text"
                  label={undefined}
                  value={saveTitle}
                  onChange={(e: any) => {
                    const newText = e.target.value;
                    if (newText.length <= 52) {
                      // 40자 이하인 경우에만 상태 업데이트
                      setErrors({ title: "" });
                      setSaveTitle(newText);
                    }
                  }}
                  placeholder="제목을 작성해 주세요.(필수)"
                />
                <StyledSaveModalErrorContent>
                  {errors?.title ?? ""}
                </StyledSaveModalErrorContent>
              </div>
              <h3 style={{ marginBottom: "4px" }}>내용</h3>

              <textarea
                style={{ height: "247px" }}
                // value={info.commentContents}
                maxLength={400}
                onChange={(event) => setContents(event?.target.value)}
                placeholder="내용을 작성해 주세요.(선택)"
              />
            </div>
          </div>

          <div className="modalButtons" style={{ marginBottom: "18px" }}>
            <button className="button create" onClick={() => handleCreate()}>
              저장
            </button>
            <button className="button" onClick={() => setOpen(false)}>
              취소
            </button>
          </div>
        </StyledCreateResultModal>
      </BasicModal>
      {opensd && (
        <AlertModal
          open={opensd}
          title={"저장되었습니다."}
          setOpen={setOpensd}
          children={
            <p>
              작업한 내용이 저장되었습니다.
              <br /> 저장된 내용은 작업내역에서 확인하실 수 있습니다.
            </p>
          }
          setOpenSaveModal={setOpen}
        />
      )}
    </>
  );
};
