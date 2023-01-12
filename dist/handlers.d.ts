/// <reference types="node" />
import * as http from 'node:http';
import { HandlerT, RequestListenerT, RouterT } from './types.js';
import { ActivatorT } from 'elemental-0';
export declare let matchAllTo: (fn: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>) => HandlerT;
export declare let matchPathToRedirect: (pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308) => HandlerT;
export declare let matchAllToDefault: (code: number, template?: ActivatorT | undefined) => HandlerT;
export declare let matchPathToMediaType: (docRoot: string, pathRegex: RegExp, mediaType: string) => HandlerT;
export declare let matchPathTo: (docRoot: string, pathRegex: RegExp, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>) => HandlerT;
export interface RequestListenerHandlers {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    responseHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    errorHandler: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}
export interface RequestListenerOptions {
    handlers: RequestListenerHandlers;
    template?: ActivatorT;
    responseTimeout?: number;
}
export declare let requestListener: (fn: HandlerT | RouterT, option: RequestListenerOptions) => RequestListenerT;
