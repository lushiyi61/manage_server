"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_log4js_1 = require("common-log4js");
var path_1 = require("path");
var logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
var config = require("./config.json");
var serverMgr_1 = require("./manager/serverMgr");
var manager_1 = require("./server/manager");
process.on('uncaughtException', function (err) {
    logger.fatal("uncaughtException=======================>\n", err);
});
logger.info("==========================程  序  启  动==========================");
//启动服务
manager_1.server_start(config.http_ip, config.http_port);
//定时清理僵尸服务
serverMgr_1.server_mgr_start(config.tick_time);
logger.info("==========================程序 启动 完毕==========================");
