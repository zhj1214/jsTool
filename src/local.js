// 用于存储对象 数据
var cache = {
  set: function(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  fetch: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  /************************************ 用于保存当前用户相关信息 val 新增属性，或者修改原属性 ******************/
  /**
   * @description 缓存用户信息
   * @param val: 用户信息
   */
  setCurrentUser(val = {}) {
    var user = this.fetch("currentUserInfor") || {};
    var obj = Object.assign({}, user, val);
    localStorage.setItem("currentUserInfor", JSON.stringify(obj));
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUserInfor"));
  },
  removeCurrentUserKey(key) {
    var user = this.fetch("currentUserInfor");
    delete user[key];
    localStorage.setItem("currentUserInfor", JSON.stringify(user));
  },
  /************************************ 记录 接口请求状况 ************************************/
  /**
   * @description 保存 请求记录
   * @param params: res.config.data,
   * @param url: res.config.url,
   * @param time: this.$Util.getTimeFormat("yyyy-MM-dd HH:mm:ss"),
   * @param msg: res.data.message,
   * @param page: location.href.split("#")[1],
   * @param status: res.data.code
   */
  setRequestInfo(val) {
    let infos = this.fetch("locationRequestInfo");
    if (infos) {
      infos.push(val);
    } else {
      infos = [val];
    }
    localStorage.setItem("locationRequestInfo", JSON.stringify(infos));
  },
  getRequestInfo() {
    return JSON.parse(localStorage.getItem("locationRequestInfo"));
  },
  removeLocationRequestInfo() {
    localStorage.removeItem("locationRequestInfo");
  }
};
export default cache;
