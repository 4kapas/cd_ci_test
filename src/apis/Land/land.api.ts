import { instance } from "../../services/AxiosApiService";

/**
 * land 상세
 * landInfo
 */
export const getLand = async (params: any): Promise<void> => {
  try {
    const landInfo = parseInt(params.queryKey[1]);
    console.log(params, "landinfos data?");

    return await instance.get(`/land/${landInfo}`).then((res) => {
      const responseData = res?.data;

      return responseData || {};
    });
  } catch (error) {
    console.error("Error update landinfos:", error);
    throw error;
  }
};

/**
 * land 상세
 * landInfo
 */
export const getSaveDataLand = async (params: any): Promise<void> => {
  try {
    const landInfo = parseInt(params.queryKey[1]);
    // console.log(landInfo, "landinfos");

    return await instance.get(`/board/land/${landInfo}`).then((res) => {
      const responseData = res?.data;

      return responseData || {};
    });
  } catch (error) {
    console.error("Error update Land:", error);
    throw error;
  }
};

/**
 * land 저장 (웹)어드민용
 * @param data
 * @returns
 */
export const updateLand = async (data: any): Promise<void> => {
  try {
    console.log(data, "updateland");
    const response = await instance.post(`/land/`, data ?? "");

    // 안전하게 response 객체의 유효성을 확인하고 data 속성을 참조
    const responseData = response?.data;

    return responseData || {}; // responseData도 null 또는 undefined인지 확인 후 반환
  } catch (error) {
    console.error("Error update Land:", error);
    throw error;
  }
};

export const updateBoardAdmin = async (data: any) => {
  try {
    const response = await instance.post(`/board/admin`, data);
    console.log("res", response);
    return response.data || {};
  } catch (error) {
    console.error("Error creating updateBoardAdmin:", error);
    throw error;
  }
};
export const getLandsaveDataList = async (params: any) => {
  try {
    const landInfo = parseInt(params.queryKey[1]);
    const response = await instance.get(`/land/list/${landInfo}`);
    console.log("res save list", response);
    return response.data || {};
  } catch (error) {
    console.error("Error creating getLandsaveDataList:", error);
    throw error;
  }
};

export const getLandsaveSerchDataList = async (params: any) => {
  try {
    const { boardId, answerTitle, startDate, endDate } = params.queryKey[1];
    console.log(params, "paramss");

    // URL 쿼리 스트링 만들기
    const queryParams = [];
    if (answerTitle) queryParams.push(`answerTitle=${answerTitle}`);
    if (startDate) queryParams.push(`startDate=${startDate}`);
    if (endDate) queryParams.push(`endDate=${endDate}`);
    const queryString = queryParams.join("&");

    // API 요청 보내기
    const response = await instance.get(
      `/land/list/${parseInt(boardId)}?${queryString}`
    );
    console.log(response.data, "search data");

    return response.data || {};
  } catch (error) {
    console.error("Error creating getLandsaveSerchDataList:", error);
    throw error;
  }
};
