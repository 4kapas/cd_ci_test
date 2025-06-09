import { useState, useEffect } from "react";
//libraries
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
//component
import { BgFullButton, BorderedButton, BasicCarousel } from "@/component";
//style
import {
  DetailWrapper,
  DetailMetaInfo,
  DetailImage,
  DetailContent,
  DetailReplayTextarea,
} from "./style";
//services
import { COOKIE_SAVE_USER_ID, cookieStorage } from "@/services/cookie";
import { createComment } from "@/apis/Comment/comment.api";

export const BoardDetailPage = ({ data, setSelectedModal }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [files, setFiles] = useState([]);

  const { mutate: createCommentMutate } = useMutation(createComment);

  const cookieUserId = cookieStorage.getCookie(COOKIE_SAVE_USER_ID);

  const handleReplyButton = () => {
    setIsReplying(true);

    if (post.commentContents) {
      setIsReplying(true);
    }
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleSaveButton = () => {
    // 게시글 답변 저장
    const fileData = new FormData();

    if (files) {
      Array.from(files).forEach((file) => {
        fileData.append("files", file);
      });
    }

    if (post?.commentContents) {
      toast("답변이 이미 저장되었습니다.");
      return;
    }

    const updatedForm = {
      authorUser: cookieUserId,
      board: post?.boardId,
      contents: replyContent,
      meta: "",
      url: "",
    };

    console.log("게시글 답변 저장", updatedForm);

    const blob = new Blob([JSON.stringify(updatedForm)], {
      type: "application/json",
    });

    fileData.append("comment", blob);

    createCommentMutate(fileData, {
      onSuccess: () => {
        setIsReplying(false);

        queryClient.invalidateQueries(["board"]);
        queryClient.invalidateQueries(["board", post?.boardId]);

        queryClient.refetchQueries("board");
        queryClient.refetchQueries(["board", post?.boardId]);
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleCancelButton = () => {
    // 취소버튼
    if (post?.commentContents) {
      setIsReplying(false);
    } else {
      setIsReplying(false);
      setReplyContent("");
    }
  };

  const handleCreate = () => {
    navigate(
      `/service/potree/UOK/${post.boardDistrict}?boardId=${post.boardId}`
    );
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedModal(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  useEffect(() => {
    console.log("상세 ", data);

    if (data?.resultObject.commentContents) {
      setReplyContent(data?.resultObject.commentContents);
      setIsReplying(true);
    }

    setPost(data?.resultObject);
  }, [data]);

  if (!post) return <div>No data</div>;

  return (
    <DetailWrapper>
      <>
        <DetailMetaInfo className="detailTitle">
          <h1>{post.boardTitle}</h1>
        </DetailMetaInfo>
        <DetailMetaInfo>
          <span>주소</span> : {post.boardDistrict}
        </DetailMetaInfo>
        <DetailMetaInfo>
          <span>등록일</span> : {post.createdDate}
        </DetailMetaInfo>
        <DetailMetaInfo>
          <span>민원인</span> : {post.complainant}
        </DetailMetaInfo>
        <DetailMetaInfo>
          <span>휴대전화번호</span> : {post.boardMobile}
        </DetailMetaInfo>
        <DetailImage>
          <BasicCarousel items={post.boardFileIdList || []} />
        </DetailImage>
        <DetailMetaInfo>
          <span className="detail-meta-info-content">내용</span>
        </DetailMetaInfo>
        <DetailContent>
          <textarea disabled value={post?.boardContents} onChange={undefined} />
        </DetailContent>

        {isReplying && (
          <>
            <DetailMetaInfo>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#007A68" }}>답변</span>
                <BgFullButton
                  width="142px"
                  height="44px"
                  onClick={handleCreate}
                  theme={"blueFullLight"}
                  fontSize="14px"
                >
                  분석화면 등록
                </BgFullButton>
              </Box>
            </DetailMetaInfo>
            <DetailReplayTextarea
              disabled={post.commentContents ? true : false}
              value={replyContent}
              onChange={handleReplyChange}
              style={{ width: "100%", height: "150px" }}
              placeholder="답변을 작성하세요."
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "15px",
                margin: "20px 0 40px",
              }}
            >
              <BgFullButton
                width="116px"
                height="44px"
                onClick={handleSaveButton}
              >
                저장
              </BgFullButton>
              <BorderedButton
                minWidth="116px"
                height="44px"
                onClick={handleCancelButton}
              >
                취소
              </BorderedButton>
            </Box>
          </>
        )}
        {!isReplying && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "24px",

              "& > *": {
                marginRight: "12px",
              },
            }}
          >
            <BgFullButton
              minWidth="116px"
              height="44px"
              s
              onClick={handleReplyButton}
            >
              답변등록
            </BgFullButton>
            <BorderedButton
              minWidth="116px"
              height="44px"
              onClick={() => setSelectedModal(false)}
            >
              취소
            </BorderedButton>
          </Box>
        )}
      </>
    </DetailWrapper>
  );
};
