import { instance } from "../../services/AxiosApiService";

/**
 * Comment 저장
 * @param data
 * @returns
 */
export const createComment = async (data: any) => {
  try {
    const response = await instance.post(`/comment`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data || {};
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};
