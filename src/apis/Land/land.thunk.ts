import { useQuery, UseQueryResult } from "react-query";
import { getLandsaveSerchDataList } from "./land.api";
// board detail 조회
export const findLandSaveData = (
  savedBoardId: any
): UseQueryResult<any, any> => {
  return useQuery({
    queryKey: ["findLandSaveData", savedBoardId],
    queryFn: getLandsaveSerchDataList,
    enabled: !!savedBoardId,
  });
};
