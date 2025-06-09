// import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN, cookieStorage } from "services";
export const SuperURL = "http://203.234.214.91:10840";
// export const apiUrl = (path:string) => `${baseURL}${path}`;

/**
 * 현재 프로젝트에선 로그인에서만 시험적으로 사용중 후엔 이걸로 base를 맞출꺼같음
 */
export const ApiService = {
  get: async <T>(path: string, body: object, baseURL: string): Promise<T> => {
    try {
      // const accessToken = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);
      const accessToken = false;
      // const tokens = useAuthStore.getState().tokens;
      const headers: HeadersInit = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      let url = `${baseURL}${path}`;
      if (body) {
        url += setQueryString(body);
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        // 응답 실패 에러 처리
        const errorData = await response.json();
        throw new Error(errorData.message || "API 요청 실패");
      }
      const data = await response.json();
      return data as T;
    } catch (e) {
      throw e;
    }
  },
  post: async <T>(
    path: string,
    body: object | FormData,
    baseURL: string
  ): Promise<T> => {
    try {
      // const tokens = useAuthStore.getState().tokens;
      const accessToken = false;
      // const accessToken = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);
      console.log(accessToken ? true : false);
      const headers = new Headers();
      if (accessToken) {
        headers.append("Authorization", `Bearer ${accessToken}`);
      }

      let requestBody: string | FormData = "";
      if (body instanceof FormData) {
        // If the body is FormData, set appropriate headers and body
        requestBody = body;
      } else {
        headers.append("Content-Type", "application/json");
        requestBody = JSON.stringify(body);
      }
      const response = await fetch(`${baseURL}${path}`, {
        method: "POST",
        headers,
        body: requestBody,
      });

      if (!response.ok) {
        // 응답 실패 에러 처리
        const errorData = await response.json();
        throw new Error(errorData.message || "API 요청 실패");
      }

      const data = await response.json();
      return data as T;
    } catch (e) {
      // console.error(e);
      throw e;
    }
  },
  delete: async <T>(
    path: string,
    body: object,
    baseURL: string
  ): Promise<T> => {
    try {
      const accessToken = false;
      // const accessToken = cookieStorage.getCookie(COOKIE_ACCESS_TOKEN);
      // const tokens = useAuthStore.getState().tokens;
      const headers: HeadersInit = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      let url = `${baseURL}${path}`;
      if (body) {
        url += setQueryString(body);
      }

      const response = await fetch(url, { method: "DELETE", headers });

      if (!response.ok) {
        // 응답 실패 에러 처리
        const errorData = await response.json();
        throw new Error(errorData.message || "API 요청 실패");
      }
      const data = await response.json();
      return data as T;
    } catch (e) {
      throw e;
    }
  },
  getWithRefreshToken: async <T>(
    path: string,
    body: object,
    baseURL: string
  ): Promise<T> => {
    try {
      const refreshToken = false;
      // const refreshToken = cookieStorage.getCookie(COOKIE_REFRESH_TOKEN);
      // const tokens = useAuthStore.getState().tokens;
      const headers: HeadersInit = refreshToken
        ? { REFRESH_TOKEN: `Bearer ${refreshToken}` }
        : {};

      let url = `${baseURL}${path}`;
      if (body) {
        url += setQueryString(body);
      }

      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        // 응답 실패 에러 처리
        const errorData = await response.json();
        throw new Error(errorData.message || "API 요청 실패");
      }

      const data = await response.json();
      return data as T;
    } catch (e) {
      // console.error(e);
      throw e;
    }
  },
  // 다른 HTTP 메서드들도 유사하게 구현할 수 있습니다.
};

const setQueryString = (data: any) => {
  let requestUrl = "";
  for (let key of Object.keys(data)) {
    const value = data[key];
    if (requestUrl.length < 1) {
      if (value) requestUrl += `?${key}=${value}`;
    } else {
      if (value) requestUrl += `&${key}=${value}`;
    }
  }
  return requestUrl;
};
