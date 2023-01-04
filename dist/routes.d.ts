/// <reference types="node" />
import * as http from 'node:http';
import { HTTPResponse } from './http_responses.js';
import { accept, deny } from 'wrighter';
export { createRoute, logger as log } from 'wrighter';
type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>;
type RouteT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<HTTPResponse>;
export declare let matchSchemePort: (scheme: "http" | "https", port: number) => (...routes: any[]) => ReturnT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let routeTo: (args_0: RouteT) => (...routes: any[]) => RouteT;
export declare let redirectTo: (location: string) => (...routes: any[]) => RouteT;
