/// <reference types="node" />
import http from 'node:http';
export { createRoute, createHandler, logger as log } from 'wrighter';
export { logger } from 'wrighter';
export { matchHost, matchMethod, matchPath, matchSchemePort } from './routes.js';
export { redirectTo, routeTo } from './handlers.js';
export interface RequestListenerEvents {
    request: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    response: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    error: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}
export interface RequestListenerOptions {
    events: RequestListenerEvents;
    responseTimeout?: number;
}
export declare let createRequestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>, options?: RequestListenerOptions) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
