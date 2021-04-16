import { ServerReq } from "../interface/api";
export declare function server_report_async(server_info: ServerReq, find_ip: string, find_port: number, find_tick_time: number): Promise<void>;
export declare function server_update_load(load: number): Promise<void>;
