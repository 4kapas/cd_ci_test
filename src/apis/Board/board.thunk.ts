import { useQuery, UseQueryResult } from "react-query";
import { getLandsaveDataList } from "../Land/land.api";
import { getBoardDetail } from "./board.api";

// board detail 조회
export const boardDetailData = (boardId: any) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardDetail(boardId),
    enabled: !!boardId,
  });
};

// board detail 조회
export const boardJobDetailData = (
  savedBoardId: any
): UseQueryResult<any, any> => {
  return useQuery({
    queryKey: ["boardJobDetailData", savedBoardId],
    queryFn: getLandsaveDataList,
    enabled: !!savedBoardId,
  });
};
