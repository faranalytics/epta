/// <reference types="node" />
export { createRoute } from 'wrighter';
import * as http from 'node:http';
export declare class Context {
    [key: string]: any;
    toString(): string;
}
export type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<boolean | null | undefined>;
export declare let logRequestTo: (log: (message: string) => void, formatter?: ((remoteAddress?: string, method?: string, url?: string) => string) | undefined) => (..._routes: any[]) => ReturnT;
export declare let matchSchemePort: (scheme: string, port: number) => (..._routes: any[]) => ReturnT;
export declare let matchHost: (hostRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let matchMethod: (methodRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let matchPath: (pathRegex: RegExp) => (..._routes: any[]) => ReturnT;
export declare let routeTo: (args_0: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => boolean | null | void) => (..._routes: any[]) => ReturnT;
export declare let requestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<boolean | null | void>, options: {
    errorLog: (error: string) => void;
}) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
//# sourceMappingURL=routes.d.ts.map