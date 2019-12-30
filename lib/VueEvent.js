"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _vue = require("vue");

var _vue2 = _interopRequireDefault(_vue);

var _axios = require("../lib/axios");

var _util = require("../lib/util");

var _util2 = _interopRequireDefault(_util);

var _date = require("../lib/date");

var _date2 = _interopRequireDefault(_date);

var _env = require("../lib/env");

var _env2 = _interopRequireDefault(_env);

var _api = require("../lib/api");

var _api2 = _interopRequireDefault(_api);

var _local = require("../lib/local");

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.prototype.$ajaxGet = _axios.axiosGet;
_vue2.default.prototype.$ajaxPost = _axios.axiosPost;
_vue2.default.prototype.$API = _api2.default;
_vue2.default.prototype.$Util = _util2.default;


_vue2.default.prototype.$ENV = _env2.default;
_vue2.default.prototype.$Cache = _local2.default;

var VueEvent = new _vue2.default({
  data: function data() {
    return {
      browseCommodity: {
        goodId: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created: function created() {
    _vue2.default.prototype.$vTool = this;
  },

  methods: {
    addApi: function addApi(apis) {
      _vue2.default.prototype.$API = (0, _assign2.default)({}, this.$API, apis);
    },
    addEnv: function addEnv(envs) {
      _vue2.default.prototype.$ENV = (0, _assign2.default)({}, this.$ENV, envs);
    },
    addUtils: function addUtils(utils) {
      _vue2.default.prototype.$Util = (0, _assign2.default)({}, this.$Util, utils);
    },
    sampling: function sampling(type, goodsId) {
      var self = this;
      var startTime = new Date();
      console.log(startTime);
      var data = {
        requestUrl: location.href,
        inTime: this.$Util.getTimeFormat("yyyy-MM-dd HH:mm:ss"),
        openId: localStorage.getItem("openId") || "",
        phone: localStorage.getItem("userPhone") || "",
        type: type
      };
      if (type == "LOGIN") {
        data.remark = "那个公众号进入了积分商城";
        data.platform = localStorage.getItem("scene") || "";
      } else if (type == "BROWSER_GOODS") {
        if (self.browseCommodity.goodId != goodsId) {
          self.browseCommodity.goodId = goodsId;
          return self.browseCommodity.startTime = this.$Util.getTimeFormat("yyyy-MM-dd HH:mm:ss");
        } else {
          self.browseCommodity.endTime = this.$Util.getTimeFormat("yyyy-MM-dd HH:mm:ss");
          data.goodsId = goodsId;
          data.remark = "浏览什么商品，浏览多久";
          this.$Util.calculateAtoBtimeDifference(self.browseCommodity.startTime, self.browseCommodity.endTime).then(function (res) {
            data.browsingTime = res;
          });
        }
      } else if (type == "ADD_SHOPCART") {
        data.remark = "添加什么商品到 -> 购物车";
        data.goodsId = goodsId;
      } else if (type == "GOODS_EXCHANGE") {
        data.remark = "购买了什么商品";
        data.goodsIds = goodsId;
      }
      self.$ajaxPost("/eventTracking", data).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.info(err.message);
      });
    },
    advertisingSwipeJump: function advertisingSwipeJump(item) {
      var address = item.linkAddress || "";
      if (address) {
        var host = this.$ENV.thirdHost;
        var baseHost = this.$ENV.baseHost;
        if (address.search(host) != -1) {
          window.location.href = item.linkAddress + "?openId=" + localStorage.getItem("openId");
        } else if (address.indexOf(baseHost) != -1) {
          var path = address.split("/#");
          this.$router.push({
            path: path[1]
          });
        } else {
          window.location.href = item.linkAddress;
        }
      }
    },
    loadWXauthorizationPage: function loadWXauthorizationPage(number) {
      var APPID = this.$ENV.appId;
      var href = window.location.origin + "/" + window.location.hash;
      if (process.env.NODE_ENV === "production") {
        localStorage.setItem("openId", "");
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURIComponent(href) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      }
    },
    getMemberLoginInfo: function getMemberLoginInfo(code) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        var code = _this.$Util.getUrlParams("code");
        if (code.length > 0) {
          _this.$ajaxGet(_this.$API.avoidLogin, {
            code: code
          }).then(function (res) {
            if (res.data) {
              if (res.data.openId) {
                localStorage.setItem("openId", res.data.openId);
              }
            }
            resolve(res);
          }).catch(function (err) {
            reject(err);
          });
        } else {
          reject("nologin");
        }
      });
    },
    getInviteBuildRelation: function getInviteBuildRelation(distributorSysnumber) {
      this.$ajaxPost(this.$API.member_distribution, {
        distributorSysnumber: distributorSysnumber,
        memberId: localStorage.getItem("memberId")
      });
    }
  }
});
exports.default = VueEvent;