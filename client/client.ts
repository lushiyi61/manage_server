import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import http = require("http");
import { ServerReq, SERVER_REQUEST } from "../interface/api";

function http_post_async(host: string, port: number, path: string, data: any) {
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
    })
};

const SERVER_INFO: ServerReq = { server_type: "", server_id: "", tick_time: 0, http_ip: "", http_port: 0, ws_ip: "", ws_port: 0, load: 0, memory: "" };

export async function server_report_async(server_info: ServerReq, find_ip: string, find_port: number, find_tick_time: number) {
    Object.assign(SERVER_INFO, server_info);
    await create_async(find_ip, find_port, find_tick_time);
}

export async function server_update_load(load: number) {
    SERVER_INFO.load = load;
}

async function create_async(find_ip: string, find_port: number, find_tick_time: number) {
    const now = Date.now();
    if (now > SERVER_INFO.tick_time + find_tick_time) {
        SERVER_INFO.tick_time = now;
        const mem = process.memoryUsage();
        SERVER_INFO.memory = JSON.stringify({
            heapTotal: mem_format(mem.heapTotal),
            heapUsed: mem_format(mem.heapUsed),
            rss: mem_format(mem.rss)
        })
        // logger.debug("load:%s memory:%s", SERVER_INFO.load, SERVER_INFO.memory);
        try {
            await http_post_async(find_ip, find_port, SERVER_REQUEST.CREATE, SERVER_INFO);
        } catch (error) {
            logger.warn("cann't connect to find server. ip:[%s] port:[%s] ", find_ip, find_port);
        }
    }
    setTimeout(create_async, 2000, find_ip, find_port, find_tick_time);
}

function mem_format(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
};