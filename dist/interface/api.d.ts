export declare const SERVER_REQUEST: {
    CREATE: string;
    FIND: string;
    ALL: string;
};
export interface ServerReq {
    server_type: string;
    server_id: string;
    tick_time: number;
    http_ip: string;
    http_port: number;
    ws_ip: string;
    ws_port: number;
    load: number;
    memory: string;
}
export interface ServerRes {
    http_ip: string;
    http_port: number;
    ws_ip: string;
    ws_port: number;
}
export interface FindReq {
    server_type: string;
    server_id?: string;
}
