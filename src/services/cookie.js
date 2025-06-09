import Cookies from "js-cookie";

const CookieStorageBuilder = (cookies) => ({
  setCookie: (key, value, options) =>
    cookies.set(key, value, {
      path: "/",
      // secure: process.env.REACT_APP_BUILD_MODE === "prod" ? true : false,
      secure: false,
      sameSite: "Lax",
      ...options,
    }),
  getCookie: (key) => cookies.get(key),
  removeCookie: (key) => cookies.remove(key),
});

export const cookieStorage = CookieStorageBuilder(Cookies);

const COOKIE_BASE_NAME = "LX";

export const COOKIE_ACCESS_TOKEN = `${COOKIE_BASE_NAME}_acst`;
export const COOKIE_REFRESH_TOKEN = `${COOKIE_BASE_NAME}_rfst`;
export const COOKIE_SAVE_USER_ID = `${COOKIE_BASE_NAME}_suid`;
export const COOKIE_SAVE_USER_MOBILE = `${COOKIE_BASE_NAME}_sumobile`;
export const COOKIE_SAVE_USER_NAME = `${COOKIE_BASE_NAME}_suname`;
export const COOKIE_SAVE_USER_NICKNAME = `${COOKIE_BASE_NAME}_sunickname`;
export const COOKIE_SAVE_TYPE = `${COOKIE_BASE_NAME}_type`;
export const COOKIE_CERT = `${COOKIE_BASE_NAME}_cert`;
