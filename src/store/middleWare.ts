export const logMiddleWare = (config: any) => (set: any, get: any, api: any) =>
  config(
    (...args: any) => {
      set(...args);
    },
    get,
    api
  );
