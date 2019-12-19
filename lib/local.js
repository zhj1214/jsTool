"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {
  set: function set(key, val) {
    localStorage.setItem(key, (0, _stringify2.default)(val));
  },
  fetch: function fetch(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  setCurrentUser: function setCurrentUser() {
    var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var user = this.fetch("currentUserInfor") || {};
    var obj = (0, _assign2.default)({}, user, val);
    localStorage.setItem("currentUserInfor", (0, _stringify2.default)(obj));
  },
  getCurrentUser: function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUserInfor"));
  },
  removeCurrentUserKey: function removeCurrentUserKey(key) {
    var user = this.fetch("currentUserInfor");
    delete user[key];
    localStorage.setItem("currentUserInfor", (0, _stringify2.default)(user));
  },
  setRequestInfo: function setRequestInfo(val) {
    var infos = this.fetch("locationRequestInfo");
    if (infos) {
      infos.push(val);
    } else {
      infos = [val];
    }
    localStorage.setItem("locationRequestInfo", (0, _stringify2.default)(infos));
  },
  getRequestInfo: function getRequestInfo() {
    return JSON.parse(localStorage.getItem("locationRequestInfo"));
  },
  removeLocationRequestInfo: function removeLocationRequestInfo() {
    localStorage.removeItem("locationRequestInfo");
  }
};
exports.default = cache;