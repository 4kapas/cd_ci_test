import { instance } from "../../services/AxiosApiService";
import qs from "qs";

/**
 * List 조회
 * page, startDate, endDate
 * @param {params}
 * @returns
 */
export const getBoard = async (params: any) => {
  return await instance
    .get(`/board?${qs.stringify(params.queryKey[1])}`)
    .then((res) => res.data)
    .catch((e) => {
      console.log(e, "error");
    });
};

/**
 * board detail 조회
 * @param boardId
 * @returns
 */
export const getBoardDetail = async (boardId: any) => {
  return await instance.get(`/board/${boardId}`).then((res) => res.data);
};

/**
 * Board저장(웹)민원 대리 생성
 * @param data
 * @returns
 */
export const createBoard = async (data: any) => {
  try {
    const response = await instance.post(`/board/comment/admin`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data || {};
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

/**
 * Board저장(웹)히스토리용
 * @param data
 * @returns
 */
export const createBoardAdmin = async (data: any) => {
  try {
    const response = await instance.post(`/board/admin`, data);
    return response.data || {};
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

/**
 * board file 조회
 * @param fileId
 * @returns
 */
export const getBoardFileImage = async (fileId: any) => {
  return await instance
    .get(`/board/downloads/${fileId}`, {
      responseType: "blob",
    })
    .then((res) => {
      let imageURL = URL.createObjectURL(res.data);
      return imageURL;
    });
};
