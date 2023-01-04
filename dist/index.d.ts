/// <reference types="node" />
import http from 'node:http';
import { HTTPResponse } from './http_responses.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo } from './routes.js';
export interface RequestListenerEvents {
    request?: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    response?: (req: http.IncomingMessage, res: http.ServerResponse, httpResponse?: HTTPResponse) => void;
    error?: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}
export interface RequestListenerOptions {
    events?: RequestListenerEvents;
    responseTimeout?: number;
}
export declare let createRequestListener: (router: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>, options: RequestListenerOptions) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
