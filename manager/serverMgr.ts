import log4js from "common-log4js";
import { basename } from "path";
const logger = log4js.getLogger(basename(__filename));
///////////////////////////////////////////////////////
import { ServerReq } from "common-manager/dist/interface/api";



const SERVER_MAP_MAP = new Map<string, Map<string, ServerReq>>()  // K:服务类型  V:MAP k:服务ID v:服务
enum LOAD_TYPE { NO_LOAD } // 负载方案

/**
 * 删除超时的服务器
 */
function delete_die_server(out_time: number) {
    const now = Date.now();
    const new_out_time = 2 * out_time;
    SERVER_MAP_MAP.forEach((server_map_info, key_type) => {
        server_map_info.forEach((server_info, key_id) => {
            if (now > server_info.tick_time + new_out_time) {
                logger.warn("A service is died. type:[%s], id:[%s]", server_info.server_type, server_info.server_id);
                server_map_info.delete(key_id);
            }

            if (server_map_info.size == 0) {
                SERVER_MAP_MAP.delete(key_type);
            }
        })
    })

    // logger.debug(SERVER_MAP_MAP);
    setTimeout(delete_die_server, out_time, out_time);
}

export function create_server_info(server_info: ServerReq) {
    const { ws_ip, ws_port, http_ip, http_port, server_id, server_type } = server_info;
    //如果有必须 初始化服务器列表
    if (!SERVER_MAP_MAP.has(server_type)) SERVER_MAP_MAP.set(server_type, new Map<string, ServerReq>());
    const server_map_info = SERVER_MAP_MAP.get(server_type);
    if (server_map_info) {
        if (server_map_info.has(server_id)) {
            const old_server_info = server_map_info.get(server_id);
            if (old_server_info &&
                (old_server_info.ws_ip != ws_ip ||
                    old_server_info.ws_port != ws_port ||
                    old_server_info.http_ip != http_ip ||
                    old_server_info.http_port != http_port)
            ) {
                logger.info(server_info); // 服务有更新
            }
        } else {
            logger.info("there is new server connected, type:[%s], id:[%s]", server_type, server_id);
        }
        server_info.tick_time = Date.now();
        server_map_info.set(server_id, server_info);
    }

    // logger.info("type:%s id:%s load:%d mem:%s",
    // server_info.server_type, server_info.server_id, server_info.load, server_info.memory);
}

export function get_all_server_info(): ServerReq[][] {
    const all_servers: ServerReq[][] = [];
    SERVER_MAP_MAP.forEach(server_map_info => {
        const servers: ServerReq[] = [];
        server_map_info.forEach(server_info => {
            servers.push(server_info);
        })
        all_servers.push(servers);
    })
    return all_servers;
}

/**
 * 获取指定服务，IP 和端口
 */
export function get_server_info(server_type: string, server_id?: string): ServerReq | undefined {
    if (SERVER_MAP_MAP.has(server_type)) { // 服务存在
        const server_map_info = SERVER_MAP_MAP.get(server_type);
        if (server_map_info) {
            if (server_id && server_map_info.has(server_id)) { // 获取指定服务器
                return server_map_info.get(server_id);
            } else {  // 负载均衡
                return get_min_load_entry(server_type);
            }
        }
    }
}

export function server_mgr_start(out_time: number) {
    logger.info("server manager start . out_time is: ", out_time);
    setTimeout(delete_die_server, out_time, out_time);
}

/**
 * 获取最小的负载入口
 */
function get_min_load_entry(server_type: string, load_type: LOAD_TYPE = LOAD_TYPE.NO_LOAD): ServerReq | undefined {
    //服务器列表，必须存在
    if (!SERVER_MAP_MAP.has(server_type)) return;
    const server_map_info = SERVER_MAP_MAP.get(server_type);
    const servers: ServerReq[] = [];
    if (server_map_info) {
        server_map_info.forEach(value => {
            servers.push(value);
        })
    }

    /**
     * 负载方案
     * 1：无负载
     * 2：平均值负载
     * 3：最低值负载
     * 4: 随机负载
     */
    switch (load_type) {
        case LOAD_TYPE.NO_LOAD:
        default:
            {
                return servers[0];
            }
    }
}