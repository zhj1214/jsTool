import Vue from "vue";

// 工具类
import { axiosGet, axiosPost } from "./lib/axios";
import Util from "./lib/util"; // 全局注册公共方法
import date_p from "./lib/date";
import ENV from "./lib/env"; // 全局通用环境配置
import Api from "./lib/api";
import wxConfig from "./lib/wxConfig";
import cache from "./lib/local";

//  绑定全局属性
Vue.prototype.$ajaxGet = axiosGet;
Vue.prototype.$ajaxPost = axiosPost;
Vue.prototype.$API = Api;
Vue.prototype.$Util = Util;
Vue.prototype.$WX = wxConfig;
Vue.prototype.$vTool = this;
Vue.prototype.$ENV = ENV;
Vue.prototype.$Cache = cache;

const VueEvent = new Vue({
  data() {
    return {
      // 埋点对象
      browseCommodity: {
        goodId: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {},
  methods: {
    /**
     * @description 追加Apis
     */
    addApi(apis) {
      Vue.prototype.$API = Object.assign({}, this.$API, apis);
    },
    /**
     * @description 追加 env
     */
    addEnv(envs) {
      Vue.prototype.$ENV = Object.assign({}, this.$ENV, envs);
    },
    /**
     * @description 埋点
     */
    sampling(type, goodsId) {
      var self = this;
      var startTime = new Date();
      console.log(startTime);
      let data = {
        requestUrl: location.href,
        inTime: this.$Util.getTimeFormat("yyyy-MM-dd HH:mm:ss"),
        openId: localStorage.getItem("openId") || "",
        phone: localStorage.getItem("userPhone") || "",
        type: type
      };
      if (type == "LOGIN") {
        // 那个公众号进入了积分商城
        data.remark = "那个公众号进入了积分商城";
        data.platform = localStorage.getItem("scene") || "";
      } else if (type == "BROWSER_GOODS") {
        // 浏览什么商品，浏览多久
        if (self.browseCommodity.goodId != goodsId) {
          self.browseCommodity.goodId = goodsId;
          return (self.browseCommodity.startTime = this.$Util.getTimeFormat(
            "yyyy-MM-dd HH:mm:ss"
          ));
        } else {
          self.browseCommodity.endTime = this.$Util.getTimeFormat(
            "yyyy-MM-dd HH:mm:ss"
          );
          data.goodsId = goodsId;
          data.remark = "浏览什么商品，浏览多久";
          this.$Util
            .calculateAtoBtimeDifference(
              self.browseCommodity.startTime,
              self.browseCommodity.endTime
            )
            .then(res => {
              data.browsingTime = res;
            });
        }
      } else if (type == "ADD_SHOPCART") {
        // 添加什么商品到 -> 购物车
        data.remark = "添加什么商品到 -> 购物车";
        data.goodsId = goodsId;
      } else if (type == "GOODS_EXCHANGE") {
        // 购买了什么商品 只有购买的时候传入 数组id
        data.remark = "购买了什么商品";
        data.goodsIds = goodsId;
      }
      self
        .$ajaxPost("/eventTracking", data)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.info(err.message);
        });
    },
    /**
     * @description 广告位跳转
     */
    advertisingSwipeJump(item) {
      let address = item.linkAddress || "";
      if (address) {
        let host = this.$ENV.thirdHost;
        let baseHost = this.$ENV.baseHost;
        if (address.search(host) != -1) {
          window.location.href =
            item.linkAddress + "?openId=" + localStorage.getItem("openId");
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
    /**
     * @description 加载授权页面
     */
    loadWXauthorizationPage(number) {
      const APPID = this.$ENV.appId;
      // 拼接回调地址
      let href =
        window.location.origin +
        "/" +
        window.location.hash +
        "/?number=" +
        number;
      localStorage.removeItem("openId");
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        APPID +
        "&redirect_uri=" +
        encodeURIComponent(href) +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    },

    /**
     * 用户免登陆接口 获取用户登录信息
     * */
    getMerberInfoToOpenId(code) {
      var self = this;
      let url = "/webchatslzt-server/api/webchat/loginByWechatCode";
      return new Promise(function(resolve, reject) {
        self
          .$ajaxGet(url, { code: code })
          .then(res => {
            localStorage.setItem("lastCode", code);
            if (res.code == 10000) {
              if (res.data) {
                if (res.data.openId) {
                  localStorage.setItem("openId", res.data.openId);
                }
                localStorage.orgId = res.data.orgId;
                if (res.data.memberId) {
                  // 免登陆情况
                  localStorage.setItem("memberId", res.data.memberId);
                  localStorage.setItem("uToken", res.data.uToken);
                  localStorage.setItem("userLoginPhone", res.data.phone);
                  resolve(res);
                } else {
                  // 登出 场景
                  window.location.href = this.$ENV.baseUrl + "/#/login";
                }
              }
            } else {
              // 冻杰状态
              window.location.href = this.$ENV.baseUrl + "/#/login";
            }
          })
          .catch(err => {
            console.info(err.message);
            rejected(err);
          });
      });
    }
  }
});
export default VueEvent;
