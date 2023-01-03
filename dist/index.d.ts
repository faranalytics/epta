/// <reference types="node" />
import { ReturnT, RequestListenerOptions } from './routes.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { requestListener, RequestListenerOptions, createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo, Context } from './routes.js';
export declare function createRequestListener(router: ReturnT, options: RequestListenerOptions): (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>) => Promise<any>;
