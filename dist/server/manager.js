"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server_start = void 0;
var common_log4js_1 = require("common-log4js");
var path_1 = require("path");
var logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
var Express = require("express");
var bodyParser = require("body-parser");
var api_1 = require("../interface/api");
var serverMgr_1 = require("../manager/serverMgr");
function http_return(res, ret) {
    var httpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    res.send(httpReturn);
}
var app = Express();
app.use(bodyParser.json());
function server_start(http_ip, http_port) {
    //设置跨域访问
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body));
        next();
    });
    app.listen(http_port, http_ip);
    logger.info("Find Server Running at %s:%s", http_ip, http_port);
}
exports.server_start = server_start;
// 服务注册
app.post(api_1.SERVER_REQUEST.CREATE, function (req, res) {
    var server_info = req.body;
    logger.debug(server_info);
    serverMgr_1.create_server_info(server_info);
    http_return(res, {});
});
// 服务查询
app.post(api_1.SERVER_REQUEST.FIND, function (req, res) {
    var find_info = req.body;
    http_return(res, { data: serverMgr_1.get_server_info(find_info.server_type, find_info.server_id) });
});
// 服务监控
app.get(api_1.SERVER_REQUEST.ALL, function (req, res) {
    http_return(res, { data: serverMgr_1.get_all_server_info() });
});
