import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import Express = require("express");
import bodyParser = require('body-parser');
import { SERVER_REQUEST, IServerReq, IFindReq, HttpReturn } from "common-manager";
import { create_server_info, get_server_info, get_all_server_info } from "../manager/serverMgr";


function http_return(res: any, ret: HttpReturn) {
    const httpReturn: HttpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    res.send(httpReturn);
}

const app = Express();
app.use(bodyParser.json());
export function server_start(http_ip: string, http_port: number) {
    //设置跨域访问
    app.all('*', (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        logger.debug("[%s] %s => %s", req.method, req.path, JSON.stringify(req.body));
        next();
    });

    app.listen(http_port, http_ip);
    logger.info("Find Server Running at %s:%s", http_ip, http_port);
}

// 服务注册
app.post(SERVER_REQUEST.REPORT, (req, res) => {
    const server_info: IServerReq = req.body;
    logger.debug(server_info);
    create_server_info(server_info);
    http_return(res, {});
})

// 服务查询
app.post(SERVER_REQUEST.FIND, (req, res) => {
    const find_info: IFindReq = req.body;
    http_return(res, { data: get_server_info(find_info.server_type, find_info.server_id) })
})

// 服务监控
app.get(SERVER_REQUEST.ALL, (req, res) => {
    http_return(res, { data: get_all_server_info() });
})