
import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import config = require("./config.json");
import { server_mgr_start } from "./manager/serverMgr";
import { server_start } from "./server/manager";


process.on('uncaughtException', function (err) {
    logger.fatal("uncaughtException=======================>\n", err);
});

(async () => {
    logger.info("==========================程  序  启  动==========================");
    //启动服务
    server_start(config.http_ip, config.http_port);
    //定时清理僵尸服务
    server_mgr_start(config.tick_time);
    logger.info("==========================程序 启动 完毕==========================");
})()
