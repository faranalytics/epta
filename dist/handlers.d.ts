/// <reference types="node" />
import * as http from 'node:http';
import { accept, deny } from 'wrighter';
import { HandlerT, RequestListenerT, RouterT } from './types.js';
import { ActivatorT } from 'elemental-0';
export declare let matchAllTo: (fn: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<typeof accept | typeof deny>) => HandlerT;
export declare let matchPathToRedirect: (pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308) => HandlerT;
export declare let matchAllToDefault: (code: number, template?: ActivatorT | undefined) => HandlerT;
export declare let matchFilePathToMediaType: (docRoot: string, pathRegex: RegExp, mediaType: string) => HandlerT;
export declare let matchFilePathTo: (docRoot: string, pathRegex: RegExp, handler: HandlerT) => HandlerT;
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
