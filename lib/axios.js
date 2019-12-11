/*********************
 * @name axios
 * @author Sam
 * @date 2019/05/05
 ***********************/
import Vue from "vue";
import axios from "axios";
import ENV from "./env";
import { Toast } from "vant";

const axiosIns = axios.create({});

// req 拦截器
axiosIns.interceptors.request.use(
  req => {
    if (!req.url) {
      Toast("请求连接不存在！");
      return req;
    }
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: "请稍等..."
    });
    req.headers.uToken = localStorage.getItem("uToken") || "";
    req.headers.orgId = localStorage.getItem("orgId") || "";
    
    return req;
  },
  err => {
    return Promise.reject(err.request);
  }
);

// res 拦截器
axiosIns.interceptors.response.use(
  res => {
    Toast.clear();

    if (res && res.data) {
      return Promise.resolve(res.data);
    }
    return res.data;
  },
  err => {
    return Promise.resolve(err.response);
  }
);

export const axiosGet = (url, data = {}, msg = "接口异常", headers = {}) => {
  return axiosIns
    .get(url, { params: data, headers: headers })
    .then(res => {
      let iRes = res && res.config ? res.data : res;
      Toast.clear();
      if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
        return Promise.resolve(iRes || {});
      } else if (iRes.code === 30001 || iRes.code === 20004) {
        Toast("登录失败，请重新登录！");
        window.location.href = ENV.baseUrl + "/#/login";
      } else if (iRes.code == 60000 || iRes.code == 20000) {
        Toast(iRes.message);
      } else {
        return Promise.resolve(iRes || {});
      }
    })
    .catch(err => {
      console.info(err.message || msg);
      Toast("服务异常");
      return Promise.reject(err);
    });
};
export const axiosPost = (url, data = {}, msg = "接口异常", headers) => {
  return axiosIns
    .post(url, data, headers)
    .then(res => {
      let iRes = res && res.config ? res.data : res;
      Toast.clear();
      if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
        return Promise.resolve(iRes);
      } else if (iRes.code === 30001 || iRes.code === 20004) {
        Toast("登录失败，请重新登录！");
        window.location.href = ENV.baseUrl + "/#/login";
      } else if (iRes.code == 60000 || iRes.code == 20000) {
        Toast(iRes.message);
      } else {
        return Promise.resolve(iRes || {});
      }
    })
    .catch(err => {
      console.info(err.message || msg);
      Toast("服务异常");
      return Promise.reject(err);
    });
};