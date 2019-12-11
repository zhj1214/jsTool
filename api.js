/**
 * @author zhj
 * @description 本文件是配置接口地址
 */

import env from "./env";
const api = env.isLocalTest ? "" : "/webchatslzt-server";

export default {
  /**微信相关接口**/
  wechat_config: api + "/api/webchat/wx/signature", // 微信jssdk配置信息
};
