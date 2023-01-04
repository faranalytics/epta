/// <reference types="node" />
import * as http from 'node:http';
export { createRoute, logger as log } from 'wrighter';
export type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;
export declare let matchSchemePort: (scheme: "http" | "https", port: number) => (...routes: any[]) => ReturnT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: any[]) => ReturnT;
export declare let routeTo: (args_0: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>) => (...routes: any[]) => ReturnT;
export declare let redirectTo: (location: string) => (...routes: any[]) => ReturnT;
