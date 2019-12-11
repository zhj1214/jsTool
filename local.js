// 用于存储对象 数据
var cache = {
  set: function(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  fetch: function(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  /****************** 用于保存当前用户相关信息 val 新增属性，或者修改原属性 ******************/

  setCurrentUser(val) {
    var user = this.fetch("currentUserInfor");
    var obj = { ...user, ...val };
    localStorage.setItem("currentUserInfor", JSON.stringify(obj));
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUserInfor"));
  },
  removeCurrentUserKey(key) {
    var user = this.fetch("currentUserInfor");
    delete user[key];
    localStorage.setItem("currentUserInfor", JSON.stringify(user));
  }
};
export default cache;
