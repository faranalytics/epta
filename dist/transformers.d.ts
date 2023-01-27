/// <reference types="node" />
import * as http from 'node:http';
import { RequestListenerT, RouterT } from './types.js';
export interface RequestListenerOptions {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    responseHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    errorHandler: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
    responseTimeout?: number | null;
}
export declare let createListener: (options: RequestListenerOptions) => (...routes: (RouterT | RouterT[])[]) => RequestListenerT;
