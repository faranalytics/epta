/// <reference types="node" />
import * as http from 'node:http';
export { createRoute, logger } from 'wrighter';
export declare class Context {
    [key: string]: any;
    url?: URL;
    toString(): string;
}
export type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>;
export declare let matchSchemePort: (scheme: "http" | "https", port: number) => (...routes: any[]) => ReturnT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let routeTo: (args_0: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>) => (...routes: any[]) => ReturnT;
export interface LoggerMeta {
    scheme: string;
    url: string;
    method?: string;
    remoteAddress?: string;
    remotePort?: number;
    localAddress?: string;
    localPort?: number;
    statusCode?: number;
    errorMessage?: string;
    errorStack?: string;
}
export interface RequestListenerOptions {
    requestLogger?: (meta: LoggerMeta) => void;
    responseLogger?: (meta: LoggerMeta) => void;
    errorLogger?: (meta: LoggerMeta) => void;
}
export declare let requestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>, options: RequestListenerOptions) => (...routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
//# sourceMappingURL=routes.d.ts.map