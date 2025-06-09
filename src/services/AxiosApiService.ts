import axios, { CreateAxiosDefaults } from "axios";
import {
  cookieStorage,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
} from "./cookie";
import { ROUTE_LOGIN } from "@/routes";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { CONFIG } from "@/config";

export const extractErrorMsg = (error: any): string => {
  if (!error.response) {
    return "서버에 접속할 수 없습니다";
  } else {
    return error.response.data.error.message || "에러 발생";
  }
};

const source = axios.CancelToken.source();

export const clearUserToken = () => {
  cookieStorage.removeCookie(COOKIE_ACCESS_TOKEN);

  window.location.href = ROUTE_LOGIN;
};

class AxiosInstanceCreator {
  #instance;

  constructor(config: CreateAxiosDefaults<any> | undefined) {
    this.#instance = axios.create(config);

    this.#instance.defaults.cancelToken = source.token;

    this.interceptors();
  }

  interceptors() {
    this.#instance.interceptors.request.use(async (config) => {
      const token = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);

      if (!config.headers["Authorization"]) {
        cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);

        if (token !== null && token !== "undefined" && token !== undefined) {
          const refreshToken = cookieStorage.getCookie(COOKIE_REFRESH_TOKEN);

          const decodedToken = jwtDecode(token).exp;

          if (decodedToken !== undefined) {
            const currentTime = dayjs().unix();
            const isExpired = decodedToken < currentTime;
            if (refreshToken && isExpired) {
              clearUserToken();
            }
          }

          Object.assign(config.headers, {
            Authorization: `Bearer ${token}`,
          });
        }
      }

      if (!config.headers["Content-Type"]) {
        Object.assign(config.headers, {
          "Content-Type": "application/json",
        });
      }

      return config;
    });

    this.#instance.interceptors.response.use(
      (res) => {
        if (res.data.code && res.data.code !== 200) {
          throw new Error(res.data.message).message;
        }

        return res;
      },

      (error) => {
        if (axios.isCancel(error)) {
          // clearUserToken();

          throw error;
        } else {
          if (error?.response?.status) {
            // clearUserToken();
            console.log(error?.response?.status, "status");
            return;
          }

          const result = {
            ...error.response.data,
            message: extractErrorMsg(error),
          };

          throw result;
        }
      }
    );
  }

  create() {
    return this.#instance;
  }
}

export const instance = new AxiosInstanceCreator({
  baseURL: CONFIG.HOST,
}).create();

export default AxiosInstanceCreator;
