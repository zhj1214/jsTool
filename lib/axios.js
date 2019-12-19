"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axiosPost = exports.axiosGet = undefined;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _vant = require("vant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var axiosIns = _axios2.default.create({
  timeout: 20000,
  responseType: "json",
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

axiosIns.interceptors.request.use(function (req) {
  if (!req.url) {
    (0, _vant.Toast)("请求连接不存在！");
    return req;
  }
  _vant.Toast.loading({
    duration: 0,
    forbidClick: true,
    message: "请稍等..."
  });
  req.headers.uToken = localStorage.getItem("uToken") || "";
  req.headers.orgId = localStorage.getItem("orgId") || "";

  return req;
}, function (err) {
  return _promise2.default.reject(err.request);
});

axiosIns.interceptors.response.use(function (res) {
  _vant.Toast.clear();

  if (res && res.data) {
    return _promise2.default.resolve(res.data);
  }
  return res.data;
}, function (err) {
  return _promise2.default.resolve(err.response);
});

var axiosGet = exports.axiosGet = function axiosGet(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "接口异常";
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return axiosIns.get(url, { params: data, headers: headers }).then(function (res) {
    var iRes = res && res.config ? res.data : res;
    _vant.Toast.clear();
    if (iRes && iRes.code === 10000 || iRes.code === "10000") {
      return _promise2.default.resolve(iRes || {});
    } else if (iRes.code === 30001 || iRes.code === 20004) {
      (0, _vant.Toast)("登录失败，请重新登录！");
      window.location.href = _env2.default.loginPath;
    } else if (iRes.code == 60000 || iRes.code == 20000) {
      (0, _vant.Toast)(iRes.message);
    } else {
      return _promise2.default.resolve(iRes || {});
    }
  }).catch(function (err) {
    console.info(err.message || msg);
    (0, _vant.Toast)("服务异常");
    return _promise2.default.reject(err);
  });
};
var axiosPost = exports.axiosPost = function axiosPost(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var msg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "接口异常";
  var headers = arguments[3];

  return axiosIns.post(url, data, headers).then(function (res) {
    var iRes = res && res.config ? res.data : res;
    _vant.Toast.clear();
    if (iRes && iRes.code === 10000 || iRes.code === "10000") {
      return _promise2.default.resolve(iRes);
    } else if (iRes.code === 30001 || iRes.code === 20004) {
      (0, _vant.Toast)("登录失败，请重新登录！");
      window.location.href = _env2.default.loginPath;
    } else if (iRes.code == 60000 || iRes.code == 20000) {
      (0, _vant.Toast)(iRes.message);
    } else {
      return _promise2.default.resolve(iRes || {});
    }
  }).catch(function (err) {
    console.info(err.message || msg);
    (0, _vant.Toast)("服务异常");
    return _promise2.default.reject(err);
  });
};