"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URL = require("url");
var urlFormat = require("querystring");

var Utils = {
  isEmpty: function isEmpty(val) {
    if (val) {
      if (val !== null) {
        if (typeof val === "string") {
          if (val.length == 0) {
            return true;
          }
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
    return false;
  },
  numberFormat: function numberFormat(num) {
    var value = num + "";
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    var prefix = "";
    var suffix = "";

    if (value.indexOf("+") != -1 || value.indexOf("-") != -1) {
      prefix = value.substring(0, 1);
    }
    if (value.indexOf(".") != -1) {
      suffix = value.substring(value.indexOf("."), value.length);
    }

    value = value.substring(prefix.length > 0 ? 1 : 0, suffix.length > 0 ? value.length - suffix.length : value.length);
    return prefix + value.replace(reg, "$&,") + suffix;
  },
  getCurrentSystemiOS: function getCurrentSystemiOS() {
    var u = navigator.userAgent;

    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
  },
  getTimeFormat: function getTimeFormat(format, date) {
    var time = date || new Date();
    return time.Format(format);
  },
  calculateAtoBtimeDifference: function calculateAtoBtimeDifference(time1, time2) {
    if (this.isEmpty(time1)) {
      return 0;
    }
    var self = this;
    return new _promise2.default(function (resolve, reject) {
      if (self.getCurrentSystemiOS()) {
        var end = new Date(time2.replace(/-/g, "/")).getTime();
        var star = new Date(time1.replace(/-/g, "/")).getTime();
        if (!isNaN(end) && !isNaN(star)) {
          resolve((end - star) / 1000);
        } else {
          rejected(0);
        }
      } else {
        var d1 = new Date(time1);
        time2 = time2 || new Date();
        var d2 = new Date(time2);
        var difference = parseInt(d2 - d1);
        if (difference !== undefined && difference !== null && !isNaN(difference)) {
          resolve(difference / 1000);
        } else {
          rejected(0);
        }
      }
    });
  },
  cutString: function cutString(str, len) {
    if (str.length * 2 <= len) {
      return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
      s = s + str.charAt(i);
      if (str.charCodeAt(i) > 128) {
        strlen = strlen + 2;
        if (strlen >= len) {
          return s.substring(0, s.length - 1) + "...";
        }
      } else {
        strlen = strlen + 1;
        if (strlen >= len) {
          return s.substring(0, s.length - 2) + "...";
        }
      }
    }
    return s;
  },
  getBirthdayFromIdCard: function getBirthdayFromIdCard(idCard) {
    var birthday = "";
    if (idCard !== null && idCard !== "") {
      if (idCard.length == 15) {
        birthday = "19" + idCard.substr(6, 6);
      } else if (idCard.length == 18) {
        birthday = idCard.substr(6, 8);
      }
      birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
  },
  getSexFromIdCard: function getSexFromIdCard(idCard) {
    if (idCard !== undefined && idCard !== "") {
      var sexIndex = idCard.substr(idCard.length - 2, 1);
      if (Number(sexIndex) % 2 == 0) {
        return "女";
      } else {
        return "男";
      }
    }
  },
  getAgeFromBirthday: function getAgeFromBirthday(val) {
    if (val == null || val == "" || val == undefined) {
      return "";
    }
    var cDate = new Date(val);
    return new Date().getFullYear() - parseInt(cDate.getFullYear()) + "";
  },
  phoneEncryption: function phoneEncryption(phone) {
    return phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
  },
  getScreenSize: function getScreenSize() {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
  },

  getUrlParams: function getUrlParams(names) {
    var urlSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location.href;

    var urlParam = URL.parse(urlSearch);
    var urlObj = urlFormat.parse(urlParam.query);
    if (!urlObj[names]) {
      var hashObj = urlFormat.parse(urlParam.hash);
      for (var idx in (0, _keys2.default)(hashObj)) {
        var key = (0, _keys2.default)(hashObj)[idx];
        if (key.indexOf("?") !== -1) {
          if (key.split("?")[1] == names) {
            return hashObj[key];
          }
        }
      }
      return hashObj[names];
    }
    return urlObj[names];
  },
  objectEquals: function (_objectEquals) {
    function objectEquals(_x2, _x3) {
      return _objectEquals.apply(this, arguments);
    }

    objectEquals.toString = function () {
      return _objectEquals.toString();
    };

    return objectEquals;
  }(function (x, y) {
    var f1 = x instanceof Object;
    var f2 = y instanceof Object;
    if (!f1 || !f2) {
      return x === y;
    }
    if ((0, _keys2.default)(x).length !== (0, _keys2.default)(y).length) {
      return false;
    }
    var newX = (0, _keys2.default)(x);
    for (var p in newX) {
      p = newX[p];
      var a = x[p] instanceof Object;
      var b = y[p] instanceof Object;
      if (a && b) {
        var equal = objectEquals(x[p], y[p]);
        if (!equal) {
          return equal;
        }
      } else if (x[p] != y[p]) {
        return false;
      }
    }
    return true;
  }),
  arrayUnique: function arrayUnique(arr) {
    function unique(x, y) {
      if (isObjArr(x) == -1) {
        var f = false;
        x.forEach(function (item) {
          objectEquals(item, y) ? f = true : false;
        });
        if (f) {
          return x;
        } else {
          var xx = x;
          var yy = isObjArr(y) == -1 ? y : [y];
          return [].concat((0, _toConsumableArray3.default)(xx), (0, _toConsumableArray3.default)(yy));
        }
      } else {
        if (objectEquals(x, y)) {
          return isObjArr(x) == -1 ? x : [x];
        } else {
          var _xx = isObjArr(x) == -1 ? x : [x];
          var _yy = isObjArr(y) == -1 ? y : [y];
          return [].concat((0, _toConsumableArray3.default)(_xx), (0, _toConsumableArray3.default)(_yy));
        }
      }
    }

    var a = [].concat((0, _toConsumableArray3.default)(new _set2.default(arr)));
    var c = [];
    var b = a.filter(function (item) {
      if ((typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item)) != "object") {
        c.push(item);
      }
      return item ? (typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item)) == "object" : false;
    });
    var d = b.reduce(unique);
    return !c ? d : !d ? c : [].concat(c, (0, _toConsumableArray3.default)(d));
  },
  copyDeep: function copyDeep(templateData) {
    return JSON.parse((0, _stringify2.default)(templateData));
  },
  isObjArr: function isObjArr(value) {
    if (Object.prototype.toString.call(value) === "[object Array]") {
      return -1;
    } else if (Object.prototype.toString.call(value) === "[object Object]") {
      return 1;
    } else {
      return 0;
    }
  }
};

window.currentiOSSystem = Utils.getCurrentSystemiOS();
exports.default = Utils;