//libraries
//@ts-nocheck
import { boardDetailData } from "@/apis/Board";
import { createComment } from "@/apis/Comment/comment.api";
import { getLandsaveSerchDataList } from "@/apis/Land/land.api";
import { BasicDateRangePicker, BasicInput, BasicModal } from "@/component";
import { BasicSelectInput } from "@/component/Selects/BasicSelectInput";
import { commonImage, menuImage } from "@/consts/image";
import { ROUTE_DATASET, ROUTE_SERVICE } from "@/routes";
import { createBoard } from "@/apis/Board";
import {
  COOKIE_SAVE_USER_ID,
  COOKIE_SAVE_USER_MOBILE,
  COOKIE_SAVE_USER_NAME,
  COOKIE_SAVE_USER_NICKNAME,
  cookieStorage,
} from "@/services/cookie";
import { dateToString } from "@/utils";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useMutation, useQuery } from "react-query";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { StyledCreateResultModal, StyledSaveListContent } from "./style";

interface Props {
  titles: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  landData?: any;
  saveDatas?: any;
  onSave?: any;
  urlPosition?: string;
}

export const CreateResultModal = ({
  open,
  setOpen,
  landData,
  saveDatas,
  urlPosition,
  titles,
}: Props): JSX.Element | undefined => {
  const today = dayjs();
  // const oneYearAgo = today.subtract(1, "year");
  const [startDate, setStartDate] = useState(today.toDate());
  const [endDate, setEndDate] = useState(today.toDate());
  const [nameType, setNameType] = useState("complainant"); //NAME_OPTIONS
  const [answerUserNickname, setAnswerUserNickname] = useState("");

  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState(""); //url
  const [contents, setContents] = useState(""); //답변

  //민원인 입력 정보(이름, 전화번호, 주소)
  const [complainant, setComplainant] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [isClickListId, setIsClickListId] = useState("");
  const [files, setFiles] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [searchParams] = useSearchParams();
  const queryValue = searchParams.get("boardId");
  const landInfoIdParams = searchParams.get("landInfoId");

  const { data, isLoading } = boardDetailData(queryValue); // 게시글 상세 데이터

  const { mutate: createCommentMutate } = useMutation(createComment);
  const { mutate: createBoardMutate } = useMutation(createBoard);

  const cookieUserId = cookieStorage.getCookie(COOKIE_SAVE_USER_ID);
  const cookieUserName = cookieStorage.getCookie(COOKIE_SAVE_USER_NAME);
  const cookieUserNickname = cookieStorage.getCookie(COOKIE_SAVE_USER_NICKNAME);
  const cookieUserMobile = cookieStorage.getCookie(COOKIE_SAVE_USER_MOBILE);

  // url
  const location = useLocation();
  const { pathname, search, hash } = location;
  // const currentFullUrl = window.location.origin + pathname + search + hash;
  const clipinglUrl = window.location.origin + pathname;

  const info = data?.resultObject ?? [];

  const inputRef = useRef(null);
  const params = {
    boardId: queryValue,
    answerTitle: null, //탭
    startDate: null,
    endDate: null,
  };

  const [searchForm, setSearchForm] = useState(params);
  const {
    data: infoSerchParamsData,
    isLoading: seachSaveLoading,
    refetch,
  } = useQuery({
    queryKey: ["findLandSaveData", searchForm],
    queryFn: getLandsaveSerchDataList,
  });
  // if (seachSaveLoading) return;

  const handleCreate = () => {
    if (info) {
      const fileData = new FormData();

      if (files) {
        Array.from(files).forEach((file) => {
          fileData.append("files", file);
        });
      }

      const updatedForm = {
        authorUser: cookieUserId,
        meta: landData?.meta || "",
        board: info?.boardId || "",
        url,
        contents: info?.commentContents || "",
      };

      console.log("민원게시글 에서 url, contents 결과등록", updatedForm);

      const blob = new Blob([JSON.stringify(updatedForm)], {
        type: "application/json",
      });

      fileData.append("comment", blob);

      createCommentMutate(fileData, {
        onSuccess: () => {
          setOpen(false);
          navigate(ROUTE_DATASET);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    } else {
      const fileData = new FormData();

      if (files) {
        Array.from(files).forEach((file) => {
          fileData.append("files", file);
        });
      }

      const updatedForm = {
        authorUser: cookieUserId,
        address,
        title,
        mobile: cookieUserMobile,
        contents,
        district: serviceId,
        url,
        commentContents: contents,
        meta: landData?.meta || "",
        complainant,
      };

      console.log("새로 만들기 에서 결과등록", updatedForm);

      const blob = new Blob([JSON.stringify(updatedForm)], {
        type: "application/json",
      });

      fileData.append("board", blob);

      createBoardMutate(fileData, {
        onSuccess: () => {
          setOpen(false);
          navigate(ROUTE_DATASET);

          localStorage.removeItem("title");
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  };
  const handleLoad = () => {
    navigate(
      `${ROUTE_SERVICE}/${serviceId}?boardId=${queryValue}&landInfoId=${isClickListId}`
    );
  };

  const handleSearch = (event: any) => {
    const updateForm: any = {
      ...searchForm,
      boardId: queryValue,
      answerTitle: searchValue || null, //탭
      startDate: dateToString(startDate) || null,
      endDate: dateToString(endDate) || null,
    };

    setSearchForm(updateForm);
    refetch();
  };
  const handleNameTypeChange = (value: any) => {
    setNameType(value);
    setAnswerUserNickname(
      value === "answerUserNickname" ? "" : answerUserNickname
    );
    setComplainant(value === "complainant" ? "" : complainant);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const workListOpen = (landInfoId: string) => {
    setIsClickListId(landInfoId);
  };
  useEffect(() => {
    let title: any = localStorage.getItem("title");
    setTitle(title);
  }, []);

  //클리핑 선택영역 좌표감시
  useEffect(() => {
    if (!urlPosition) return;
    if (urlPosition?.length > 0) {
      setUrl(`${clipinglUrl}${urlPosition}`);
    }
  }, [urlPosition, clipinglUrl]);

  if (isLoading) return;

  if (!urlPosition) return;
  const isInputDisabled = urlPosition?.length > 0; // 클리핑 선택 좌표 활성화 여부

  return (
    <BasicModal
      title={titles}
      open={open}
      setOpen={setOpen}
      width={"850px"}
      height={"628px"}
      className="createHistoryModal background-none"
    >
      {info && titles === "결과등록" && (
        <StyledCreateResultModal>
          {/* 민원인 결과등록 */}
          {info && (
            <div className="content">
              <div className="top">
                <ul className="topRow not-padding">
                  <li>
                    <div className="item width80">담당자</div>
                    <div className="width80">{cookieUserNickname}</div>
                  </li>
                  <li>
                    <div className="item width80">이메일</div>
                    <div className="width200">{cookieUserName}</div>
                  </li>
                  <li>
                    <div className="item width80">url</div>
                    <div className="width290 url">
                      {isInputDisabled ? (
                        <>
                          <div className="URL">{url}</div>
                          <CopyToClipboard
                            text={url}
                            onCopy={() => alert("주소가 복사되었습니다")}
                          >
                            <img src={commonImage.copy} alt="" />
                          </CopyToClipboard>
                        </>
                      ) : (
                        <>
                          <div className="URL">{info?.url || ""}</div>
                          {/* <CopyToClipboard
                          text={info?.url || ""}
                          onCopy={() => alert("주소가 복사되었습니다")}
                        >
                          <img src={commonImage.copy} alt="" />
                        </CopyToClipboard> */}
                        </>
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="item width80">민원인</div>
                    <div className="width80">{info?.complainant}</div>
                  </li>
                  <li>
                    <div className="item width80">전화번호</div>
                    <div className="width200">{info.boardMobile}</div>
                  </li>
                  <li>
                    <div className="item width80">주소</div>
                    <div className="width290">{info.boardDistrict}</div>
                  </li>
                </ul>
              </div>
              <div className="bottom">
                <h3>의견</h3>
                <BasicInput
                  className="input"
                  type="text"
                  label={undefined}
                  value={info.boardTitle}
                  placeholder="제목을 작성해 주세요."
                  onChange={undefined}
                />
                {/* 답변 내용*/}
                <textarea
                  value={info.commentContents}
                  onChange={undefined}
                  placeholder="내용을 작성해 주세요."
                />
              </div>
            </div>
          )}

          {/* 새로 결과등록 */}
          {!info && (
            <div className="content">
              <div className="top">
                <ul className="topRow not-padding">
                  <li>
                    <div className="item width80">담당자</div>
                    <div className="width80">{cookieUserNickname}</div>
                  </li>
                  <li>
                    <div className="item width80">이메일</div>
                    <div className="width200">{cookieUserName}</div>
                  </li>
                  <li>
                    <div className="item width80">url</div>
                    <div className="width290 url">
                      {isInputDisabled && (
                        <>
                          <div className="URL">{url}</div>
                          <CopyToClipboard
                            text={url}
                            onCopy={() => alert("주소가 복사되었습니다")}
                          >
                            <img src={commonImage.copy} alt="" />
                          </CopyToClipboard>
                        </>
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="item width80">민원인</div>
                    <div className="width80">
                      <BasicInput
                        className="input"
                        type="text"
                        label={undefined}
                        placeholder="민원인"
                        value={complainant}
                        onChange={(e: any) => {
                          setComplainant(e.target.value);
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="item width80">전화번호</div>
                    <div className="width200">
                      <BasicInput
                        className="input"
                        type="text"
                        label={undefined}
                        placeholder="민원인 전화번호 입력"
                        value={mobile}
                        onChange={(e: any) => {
                          setMobile(e.target.value);
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <div className="item width80">주소</div>
                    <div className="width290">
                      <BasicInput
                        className="input"
                        type="text"
                        label={undefined}
                        placeholder="민원인 주소 입력"
                        value={address}
                        onChange={(e: any) => {
                          setAddress(e.target.value);
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bottom">
                <h3>의견</h3>
                <BasicInput
                  className="input"
                  type="text"
                  label={undefined}
                  value={title}
                  onChange={(e: any) => {
                    setTitle(e.target.value);
                  }}
                  placeholder="제목을 작성해 주세요."
                />
                <textarea
                  value={contents}
                  onChange={(e) => {
                    setContents(e.target.value);
                  }}
                  placeholder="내용을 작성해 주세요."
                />
              </div>
            </div>
          )}
          <div className="modalButtons">
            <button className="button create" onClick={handleCreate}>
              등록
            </button>
            <button className="button" onClick={() => setOpen(false)}>
              취소
            </button>
          </div>
        </StyledCreateResultModal>
      )}
      <StyledCreateResultModal>
        {titles === "작업내역" && (
          <div
            className="filter"
            style={{ display: "flex", marginBottom: "14px" }}
          >
            <BasicDateRangePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              width={undefined}
              sendValue={undefined}
            />

            {/* <BasicSelectInput
              defaultValue={undefined}
              options={undefined}
              handleSelectChange={undefined}
              value={searchValue}
              handleInputChange={handleInputChange}
              className={"border-none"}
              optionSelect={false}
              placeholder={"제목을 입력해주세요."}
              handleSearch={handleSearch}
            /> */}

            <button
              className="button search-btn"
              onClick={handleSearch}
              style={{
                background: "#fff",
                width: "fit-content",
                color: "#008A75",
                border: "1px solid #008A75",
              }}
            >
              <img src={menuImage.iconSearch2} alt="" />
              조회
            </button>
          </div>
        )}
        {infoSerchParamsData && titles === "작업내역" && (
          <>
            <div className="content" style={{ background: "none" }}>
              <div className="top">
                <ul
                  className="topRow landinfo-ul"
                  style={{ flexDirection: "column" }}
                >
                  {infoSerchParamsData?.resultObject.length > 0 ? (
                    infoSerchParamsData.resultObject
                      ?.slice() // 배열 복사본 생성
                      .sort((a: any, b: any) => b.version - a.version)
                      .map((el: any, index: number) => {
                        return (
                          <li
                            onClick={() => workListOpen(el.landInfoId)}
                            key={el.version}
                            className={
                              isClickListId === el.landInfoId ? "active" : ""
                            }
                          >
                            {/* {el.landInfoId} */}
                            <div className="landinfo-li-title">
                              <span>
                                {dayjs(el?.createdDate).format(
                                  "YYYY.MM.DD hh:mmA "
                                ) ?? ""}
                              </span>
                              <p style={{ margiRight: "auto" }}>
                                {" "}
                                {el?.answerTitle}
                              </p>
                              {el?.answerContents && (
                                <div>
                                  <img
                                    src={
                                      isClickListId === el.landInfoId
                                        ? menuImage.iconUpArrow
                                        : menuImage.iconDownArrow
                                    }
                                    alt="저장리스트 화살표 아이콘"
                                  />
                                </div>
                              )}
                            </div>
                            {el?.answerContents && (
                              <div
                                className={`save-info-content ${
                                  isClickListId === el.landInfoId
                                    ? "active"
                                    : ""
                                }`}
                              >
                                <StyledSaveListContent className="save-info-wrap">
                                  <p style={{ marginBottom: "0" }}>
                                    {el?.answerContents ??
                                      "저장내용이 없습니다."}
                                  </p>
                                </StyledSaveListContent>
                              </div>
                            )}
                          </li>
                        );
                      })
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        height: "80px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        color: "#7A828F",
                      }}
                    >
                      검색결과가 없습니다.
                    </div>
                  )}
                </ul>
              </div>
            </div>

            <div className="modalButtons">
              <button
                className="button create"
                onClick={handleLoad}
                style={{ width: "fit-content" }}
                type="button"
              >
                불러오기
              </button>
              <button className="button" onClick={() => setOpen(false)}>
                취소
              </button>
            </div>
          </>
        )}
      </StyledCreateResultModal>
    </BasicModal>
  );
};
