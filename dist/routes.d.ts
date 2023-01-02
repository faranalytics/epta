/// <reference types="node" />
import * as http from 'node:http';
export { createRoute, logger } from 'wrighter';
export declare class Context {
    [key: string]: any;
    toString(): string;
}
export type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>;
export declare let matchSchemePort: (scheme: string, port: number) => (..._routes: any[]) => ReturnT;
export declare let matchHost: (hostRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let matchMethod: (methodRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let matchPath: (pathRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let routeTo: (args_0: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>) => (..._routes: any[]) => ReturnT;
export declare let requestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>, options: {
    accessLog: (message: string) => void;
    errorLog: (message: string) => void;
}) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
//# sourceMappingURL=routes.d.ts.map