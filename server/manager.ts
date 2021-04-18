import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { http_serv_start, app } from "common-https";
import { SERVER_REQUEST, IServerReq, IFindReq, HttpReturn, IServerRes } from "common-manager";
import { create_server_info, get_server_info, get_all_server_info } from "../manager/serverMgr";


function http_return(res: any, ret: HttpReturn) {
    const httpReturn: HttpReturn = { code: "0", msg: "success" };
    Object.assign(httpReturn, ret);
    res.send(httpReturn);
}

export function server_start(http_ip: string, http_port: number) {
    http_serv_start(http_ip, http_port);
}

// 服务注册
app.post(SERVER_REQUEST.REPORT, (req, res) => {
    const server_info: IServerReq = req.body;
    create_server_info(server_info);
    http_return(res, {});
})

// 服务查询
app.post(SERVER_REQUEST.FIND, (req, res) => {
    const find_info: IFindReq = req.body;
    let data: IServerRes = null;
    const server = get_server_info(find_info.server_type, find_info.server_id);
    if (server) {
        data = {
            server_id: server.server_id,
            http_ip: server.http_ip,
            http_port: server.http_port,
            ws_ip: server.ws_ip,
            ws_port: server.ws_port,
        }
    }
    http_return(res, { data })
})

// 服务监控
app.get(SERVER_REQUEST.ALL, (req, res) => {
    http_return(res, { data: get_all_server_info() });
})