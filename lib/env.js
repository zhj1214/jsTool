"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


var envList = {
  currentEnv: "template",
  template: {
    baseUrl: "http://abc.com",
    baseHost: "abc.com",
    thirdHost: "",
    appId: "appid",
    ticketUrl: "",
    loginPath: "",
    isLocalTest: false
  }
};

exports.default = envList[envList.currentEnv];