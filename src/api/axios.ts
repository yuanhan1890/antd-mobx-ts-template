import originAxios from "axios";
import debounce from "lodash/debounce";

import get from "@/utils/get";
import { stringify } from "@/utils/urlQuery";

const logError = (param: any) => {};

const alertErrorOrdinary = debounce(() => {
  logError("服务器错误");
}, 2000);
const alertErrorMessage = (message: string) => {
  logError(message);
};
const alertError = (err: any) => {
  if (err.message) {
    alertErrorMessage(err.message);
  } else {
    alertErrorOrdinary();
  }
};

const axios = originAxios.create({
  // eslint-disable-next-line no-undef
  baseURL: process.env.BASE_URL,
  withCredentials: true,
});

axios.interceptors.response.use(
  (res) => {
    const data = typeof res.data === "object" || typeof res.data === "string" ? res.data : JSON.parse(res.data);
    if (data.message === "success" || data) {
      return data;
    }

    alertError(data);

    return Promise.reject(data);
  },
  (error: any) => {
    const code = get(error, (response) => response.status);
    if (code === 401) {
      const data = get(error, (response) => response.data);

      if (data) {
        const {
          client_id,
          name,
          redirect_uri,
          response_type,
          scope,
          state,
          url,
        } = data;

        (window as any).location = `${url}${stringify({
          state,
          response_type,
          client_id,
          scope,
          openid: "",
          redirect_uri,
          name,
        })}`;
        return Promise.reject(error);
      }
    }
    alertError(error);
    if (error.response) {
      // if (error.response.status === 401) {
      //   clear();
      // }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export default axios;
