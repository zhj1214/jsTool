"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _axios = require("./axios");

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _vant = require("vant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = {
  wxConfig: function wxConfig(apis) {
    return new _promise2.default(function (resolve, reject) {
      (0, _axios.axiosGet)(_api2.default.wechat_config, {
        url: location.href.split("#")[0],
        orgId: localStorage.getItem("orgId") || ""
      }).then(function (res) {
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: apis });
        wx.ready(function (res) {
          resolve(res);
        });
        wx.error(function (error) {
          reject(error);
        });
      });
    });
  },
  createWechatCoupon: function createWechatCoupon(sign, item) {
    var iObj = {
      timestamp: sign.timestamp,
      nonce_str: sign.nonceStr,
      signature: sign.signature,
      outer_str: sign.outerStr
    };
    window.wx.addCard({
      cardList: [{
        cardId: sign.cardId,
        cardExt: (0, _stringify2.default)(iObj)
      }],
      success: function success(res) {
        if (res && res.errMsg.match("ok")) {
          var iList = res.cardList[0];

          (0, _axios.axiosPost)(_api2.default.wechat_send_coupon_result, {
            memberId: localStorage.memberId,
            cardList: [{
              code: iList.code,
              cardId: iList.cardId,
              contactId: item.couponContactId
            }]
          }).then(function (res) {
            return console.info("success", res);
          });
        }
      },
      error: function error(err) {
        console.log(err);
      }
    });
  }
};
exports.default = Util;