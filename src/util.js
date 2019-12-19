/**
 * @author zhj
 * @description 公共工具方法
 */

/** URL 解析 **/

let URL = require("url");
let urlFormat = require("querystring");

const Utils = {
  /*************************************************工具类 属性******************************************************************/
  //   isIntegral: "cz",
  /*************************************************工具类 方法******************************************************************/
  /**
   * @description 判断一个value 是否为空
   */
  isEmpty: function(val) {
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
  /**
   * @description 千分位
   */
  numberFormat(num) {
    var value = num + "";
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    let prefix = "";
    let suffix = "";
    // 前后缀
    if (value.indexOf("+") != -1 || value.indexOf("-") != -1) {
      prefix = value.substring(0, 1);
    }
    if (value.indexOf(".") != -1) {
      suffix = value.substring(value.indexOf("."), value.length);
    }
    // 中间内容
    value = value.substring(
      prefix.length > 0 ? 1 : 0,
      suffix.length > 0 ? value.length - suffix.length : value.length
    );
    return prefix + value.replace(reg, "$&,") + suffix;
  },
  /**
   * @description 判断当前系统
   */
  getCurrentSystemiOS() {
    var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    return isiOS;
  },
  /** ***********************************************时间******************************************************************/
  /**
   * @description 时间戳转时间
   * @param format 时间格式
   * @param date   时间戳 默认当前时间
   * @example (new Date()).Format("yyyy-M-d h:m:s.S")
   * */
  getTimeFormat(format, date) {
    let time = date || new Date();
    return time.Format(format);
  },
  /**
   * @description 计算两个时间  时间间隔
   * @param time1  开始时间 yyyy-MM-dd HH:mm:ss 时间格式  必填
   * @param time2  结束时间 yyyy-MM-dd HH:mm:ss 时间格式  默认当前时间
   * */
  /*eslint prefer-promise-reject-errors: "error"*/
  calculateAtoBtimeDifference(time1, time2) {
    if (this.isEmpty(time1)) {
      return 0;
    }
    var self = this;
    return new Promise(function(resolve, reject) {
      if (self.getCurrentSystemiOS()) {
        let end = new Date(time2.replace(/-/g, "/")).getTime();
        let star = new Date(time1.replace(/-/g, "/")).getTime();
        if (!isNaN(end) && !isNaN(star)) {
          resolve((end - star) / 1000);
        } else {
          rejected(0);
        }
      } else {
        let d1 = new Date(time1);
        time2 = time2 || new Date();
        let d2 = new Date(time2);
        let difference = parseInt(d2 - d1);
        if (
          difference !== undefined &&
          difference !== null &&
          !isNaN(difference)
        ) {
          resolve(difference / 1000);
        } else {
          rejected(0);
        }
      }
    });
  },
  /** 参数说明：
   * @description 根据长度截取先使用字符串，超长部分追加…
   * @param str 对象字符串
   * @param len 目标字节长度
   * @returns 处理结果字符串
   */
  cutString(str, len) {
    // length属性读出来的汉字长度为1
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
  /**
   * @description 根据身份证号获取 生日
   */
  getBirthdayFromIdCard(idCard) {
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
  /**
   * @description 根据身份证号获取 性别
   */
  getSexFromIdCard(idCard) {
    if (idCard !== undefined && idCard !== "") {
      var sexIndex = idCard.substr(idCard.length - 2, 1);
      if (Number(sexIndex) % 2 == 0) {
        return "女";
      } else {
        return "男";
      }
    }
  },
  /**
   * @description 根据 生日 获取 年龄
   */
  getAgeFromBirthday(val) {
    if (val == null || val == "" || val == undefined) {
      return "";
    }
    const cDate = new Date(val);
    return new Date().getFullYear() - parseInt(cDate.getFullYear()) + "";
  },
  /**
   * @description 手机号加密
   */
  phoneEncryption(phone) {
    return phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
  },

  /**
   * @description 获取设备尺寸
   */
  getScreenSize() {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    };
  },
  /**
   *  @description url 参数解析
   */
  getUrlParams: function(names, urlSearch = location.href) {
    let urlParam = URL.parse(urlSearch);
    let urlObj = urlFormat.parse(urlParam.query);
    if (!urlObj[names]) {
      let hashObj = urlFormat.parse(urlParam.hash);
      for (let idx in Object.keys(hashObj)) {
        let key = Object.keys(hashObj)[idx];
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
  /**
   * @description 对象去重
   * @param var x ={a:'2'}
   * @param var b ={a:'1'}
   * @example this.$Util.objectEquals(x, y) // false
   */
  objectEquals(x, y) {
    var f1 = x instanceof Object;
    var f2 = y instanceof Object;
    if (!f1 || !f2) {
      return x === y;
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }
    var newX = Object.keys(x);
    for (var p in newX) {
      p = newX[p];
      var a = x[p] instanceof Object;
      var b = y[p] instanceof Object;
      if (a && b) {
        let equal = objectEquals(x[p], y[p]);
        if (!equal) {
          return equal;
        }
      } else if (x[p] != y[p]) {
        return false;
      }
    }
    return true;
  },

  /**
   * @description 数组去重
   * @param var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]}];
   * @example console.log(this.$Util.arrayUnique(arr));
   */
  /*eslint no-extend-native: ["error", { "exceptions": ["Array,Date"] }]*/
  arrayUnique(arr) {
    function unique(x, y) {
      if (isObjArr(x) == -1) {
        let f = false;
        x.forEach(item => {
          objectEquals(item, y) ? (f = true) : false;
        });
        if (f) {
          return x;
        } else {
          let xx = x;
          let yy = isObjArr(y) == -1 ? y : [y];
          return [...xx, ...yy];
        }
      } else {
        if (objectEquals(x, y)) {
          return isObjArr(x) == -1 ? x : [x];
        } else {
          let xx = isObjArr(x) == -1 ? x : [x];
          let yy = isObjArr(y) == -1 ? y : [y];
          return [...xx, ...yy];
        }
      }
    }

    var a = [...new Set(arr)];
    var c = [];
    var b = a.filter(item => {
      if (typeof item != "object") {
        c.push(item);
      }
      return item ? typeof item == "object" : false;
    });
    var d = b.reduce(unique);
    return !c ? d : !d ? c : [...c, ...d];
  },
  /**
   * @description 深拷贝 templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
   */
  copyDeep(templateData) {
    return JSON.parse(JSON.stringify(templateData));
  },
  /**
   * @description 判断一个变量是否是数组;
   *  -1 value是数组
   *  1 value是对象
   *  0 value不是数组也不是对象
   * */
  isObjArr(value) {
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
export default Utils;
