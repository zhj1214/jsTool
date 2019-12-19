"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = _env2.default.isLocalTest ? "" : "/webchatslzt-server";

exports.default = {
  wechat_config: api + "/api/webchat/wx/signature" };