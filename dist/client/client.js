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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server_update_load = exports.server_report_async = void 0;
var common_log4js_1 = require("common-log4js");
var path_1 = require("path");
var logger = common_log4js_1.default.getLogger(path_1.basename(__filename));
///////////////////////////////////////////////////////
var http = require("http");
var api_1 = require("../interface/api");
function http_post_async(host, port, path, data) {
    // logger.debug(JSON.stringify(data).length);
    var opt = {
        host: host,
        port: port,
        path: path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return new Promise(function (resolve, reject) {
        var req = http.request(opt, function (res) {
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
var SERVER_INFO = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };
function server_report_async(server_info, find_ip, find_port, find_tick_time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.assign(SERVER_INFO, server_info);
                    return [4 /*yield*/, create_async(find_ip, find_port, find_tick_time)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.server_report_async = server_report_async;
function server_update_load(load) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            SERVER_INFO.load = load;
            return [2 /*return*/];
        });
    });
}
exports.server_update_load = server_update_load;
function create_async(find_ip, find_port, find_tick_time) {
    return __awaiter(this, void 0, void 0, function () {
        var now, mem, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    if (!(now > SERVER_INFO.tick_time + find_tick_time)) return [3 /*break*/, 4];
                    SERVER_INFO.tick_time = now;
                    mem = process.memoryUsage();
                    SERVER_INFO.memory = JSON.stringify({
                        heapTotal: mem_format(mem.heapTotal),
                        heapUsed: mem_format(mem.heapUsed),
                        rss: mem_format(mem.rss)
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, http_post_async(find_ip, find_port, api_1.SERVER_REQUEST.CREATE, SERVER_INFO)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger.warn("cann't connect to find server. ip:[%s] port:[%s] ", find_ip, find_port);
                    return [3 /*break*/, 4];
                case 4:
                    setTimeout(create_async, 2000, find_ip, find_port, find_tick_time);
                    return [2 /*return*/];
            }
        });
    });
}
function mem_format(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}
;
