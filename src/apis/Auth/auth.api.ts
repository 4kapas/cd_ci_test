import {
  cookieStorage,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  COOKIE_SAVE_USER_ID,
  COOKIE_SAVE_USER_NAME,
  COOKIE_SAVE_USER_NICKNAME,
  COOKIE_SAVE_USER_MOBILE,
} from "@/services/cookie";
import { instance } from "../../services/AxiosApiService";
import qs from "qs";
import { toast } from "react-toastify";
import { error } from "console";
// services

/**
 * 로그인
 * username,password
 * @param data
 * @returns
 */
export const login = async (data: any) => {
  return await instance
    .post(`/user/login`, JSON.stringify(data))
    .then((res: any) => {
      console.log(res.data.resultObject, "login");
      const {
        ACCESS_TOKEN,
        REFRESH_TOKEN,
        userId,
        username,
        nickname,
        mobile,
      } = res.data.resultObject;

      if (!ACCESS_TOKEN) {
        toast("Available after administrator sign-up approval.");
        return;
      }
      cookieStorage.setCookie(COOKIE_SAVE_USER_ID, userId);
      cookieStorage.setCookie(COOKIE_SAVE_USER_NAME, username);
      cookieStorage.setCookie(COOKIE_SAVE_USER_NICKNAME, nickname);
      cookieStorage.setCookie(COOKIE_SAVE_USER_MOBILE, mobile);
      cookieStorage.setCookie(COOKIE_ACCESS_TOKEN, ACCESS_TOKEN);
      cookieStorage.setCookie(COOKIE_REFRESH_TOKEN, REFRESH_TOKEN);
      return res.data;
    })
    .catch((error: any) => {
      console.log(error);
    });
};
