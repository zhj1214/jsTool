/**
 * @author zhj
 * @description 不同环境下的域名地址配置
 * @param baseUrl 当前公众号域名
 * @param baseHost 域名 host
 * @param thirdHost 对接第三方域名，此域名需要链接后面传参openid
 * @param appId 当前公众号 appid
 * @param isLocalTest 是否开启本地调试
 * @param loginPath 登录地址
 * @param ticketUrl
 *
 */

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

export default envList[envList.currentEnv];
