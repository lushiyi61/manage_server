"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server_update_load = exports.server_report_async = void 0;
const common_log4js_1 = require("common-log4js");
const path_1 = require("path");
const logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
const http = require("http");
const api_1 = require("../interface/api");
function http_post_async(host, port, path, data) {
    // logger.debug(JSON.stringify(data).length);
    const opt = {
        host,
        port,
        path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return new Promise((resolve, reject) => {
        const req = http.request(opt, function (res) {
            res.setEncoding("utf-8");
            res.on("data", function (chunk) {
                resolve(JSON.parse(chunk));
            });
        });
        req.on("error", function (err) {
            logger.warn(err.message);
            reject({});
        });
        req.write(JSON.stringify(data));
        req.end();
    });
}
;
const SERVER_INFO = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };
function server_report_async(server_info, find_ip, find_port, find_tick_time) {
    return __awaiter(this, void 0, void 0, function* () {
        Object.assign(SERVER_INFO, server_info);
        yield create_async(find_ip, find_port, find_tick_time);
    });
}
exports.server_report_async = server_report_async;
function server_update_load(load) {
    return __awaiter(this, void 0, void 0, function* () {
        SERVER_INFO.load = load;
    });
}
exports.server_update_load = server_update_load;
function create_async(find_ip, find_port, find_tick_time) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        if (now > SERVER_INFO.tick_time + find_tick_time) {
            SERVER_INFO.tick_time = now;
            const mem = process.memoryUsage();
            SERVER_INFO.memory = JSON.stringify({
                heapTotal: mem_format(mem.heapTotal),
                heapUsed: mem_format(mem.heapUsed),
                rss: mem_format(mem.rss)
            });
            // logger.debug("load:%s memory:%s", SERVER_INFO.load, SERVER_INFO.memory);
            try {
                yield http_post_async(find_ip, find_port, api_1.SERVER_REQUEST.CREATE, SERVER_INFO);
            }
            catch (error) {
                logger.warn("cann't connect to find server. ip:[%s] port:[%s] ", find_ip, find_port);
            }
        }
        setTimeout(create_async, 2000, find_ip, find_port, find_tick_time);
    });
}
function mem_format(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}
;
//# sourceMappingURL=client.js.map