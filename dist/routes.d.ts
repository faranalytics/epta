/// <reference types="node" />
export { createRoute } from 'wrighter';
import * as http from 'node:http';
export declare class Context {
    [key: string]: any;
    toString(): string;
}
type T = [
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context
];
export declare function httpAdapter(router: (...args: T) => Promise<boolean | void | null>): (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
export declare let logRequest: (log: (message: string) => void) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
export declare let matchSchemePort: (scheme: string, port: number) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
export declare let matchHost: (hostRegex: RegExp) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
export declare let matchMethod: (methodRegex: RegExp) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
export declare let matchPath: (pathRegex: RegExp) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
export declare let routeTo: (routeArgs_0: (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => void) => (..._routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, ctx: Context) => Promise<boolean | void | null>;
//# sourceMappingURL=routes.d.ts.map