/**
 * @author zhj
 * @description 微信配置封装
 */
import { axiosGet, axiosPost } from "./axios";
import API from "./api";
import store from "../store/store";
import { Toast } from "vant";

const Util = {
  // 微信权限配置
  wxConfig(apis) {
    return new Promise((resolve, reject) => {
      axiosGet(API.wechat_config, {
        url: location.href.split('#')[0],
        orgId: localStorage.getItem("orgId") || ""
      }).then(res => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见附录1
          jsApiList: apis // 必填，需要使用的JS接口列表，所有JS接口列表见附录2//["addCard", "chooseWXPay", "updateAppMessageShareData"] 
        });
        wx.ready(function(res) {
          resolve(res);
        });
        wx.error(function(error) {
          reject(error);
        });
      });
    });
  },
  // 添加微信卡券到卡券包
  createWechatCoupon(sign, item) {
    let iObj = {
      timestamp: sign.timestamp,
      nonce_str: sign.nonceStr,
      signature: sign.signature,
      outer_str: sign.outerStr
    };
    window.wx.addCard({
      cardList: [
        {
          cardId: sign.cardId,
          cardExt: JSON.stringify(iObj)
        }
      ],
      success: function(res) {
        // 添加卡券成功后告知后台
        if (res && res.errMsg.match("ok")) {
          let iList = res.cardList[0];
          store.commit("SET_ADDCARD_FLAG", true);
          axiosPost(API.wechat_send_coupon_result, {
            memberId: localStorage.memberId,
            cardList: [
              {
                code: iList.code,
                cardId: iList.cardId,
                contactId: item.couponContactId
              }
            ]
          }).then(res => console.info("success", res));
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
};
export default Util;
