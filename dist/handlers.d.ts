/// <reference types="node" />
import * as http from 'node:http';
import { accept, deny } from 'wrighter';
import { HandlerT, RequestListenerT, RouterT } from './types.js';
import { ActivatorT } from 'elemental-0';
export declare let callFunction: (fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>) => HandlerT;
export declare let permanentRedirectTo: (location: string) => HandlerT;
export declare let defaultRoute: (code: number, template?: ActivatorT | undefined) => HandlerT;
export declare let matchMediaType: (docRoot: string, mimeMap: {
    [key: string]: RegExp;
}, template?: ActivatorT | undefined) => HandlerT;
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
