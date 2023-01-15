/// <reference types="node" />
import * as http from 'node:http';
import { HandlerT, RequestListenerT, RouterT } from './types.js';
export declare let matchAllTo: (fn: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>) => HandlerT;
export declare let matchPathToRedirect: (pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308) => HandlerT;
export declare let matchAllToDefaultResponse: (code: number, body?: string | undefined) => HandlerT;
export declare let matchPathToFileMediaType: (docRoot: string, pathRegex: RegExp, mediaType: string) => HandlerT;
export declare let matchPathToFile: (docRoot: string, pathRegex: RegExp, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>) => HandlerT;
export declare let matchPathTo: (pathRegex: RegExp, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>) => HandlerT;
export interface RequestListenerHandlers {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    responseHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    errorHandler: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}
export interface RequestListenerOptions {
    handlers: RequestListenerHandlers;
    responseTimeout?: number;
}
export declare let requestListener: (fn: HandlerT | RouterT, option: RequestListenerOptions) => RequestListenerT;
