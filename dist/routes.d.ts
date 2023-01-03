/// <reference types="node" />
import * as http from 'node:http';
import { HTTPResponse } from './http_responses.js';
export { createRoute, logger as log } from 'wrighter';
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
export declare let redirectTo: (location: string) => (...routes: any[]) => ReturnT;
export interface RequestListenerEvents {
    request?: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => void;
    response?: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context, httpResponse?: HTTPResponse) => void;
    error?: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context, error: Error) => void;
}
export interface RequestListenerOptions {
    events: RequestListenerEvents;
    timeout: number;
}
export declare let requestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse, ctx: Context) => Promise<any>, options: RequestListenerOptions) => (...routes: any[]) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
