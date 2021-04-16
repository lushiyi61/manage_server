import { ServerReq } from "../interface/api";
export declare function create_server_info(server_info: ServerReq): void;
export declare function get_all_server_info(): ServerReq[][];
/**
 * 获取指定服务，IP 和端口
 */
export declare function get_server_info(server_type: string, server_id?: string): ServerReq | undefined;
export declare function server_mgr_start(out_time: number): void;
