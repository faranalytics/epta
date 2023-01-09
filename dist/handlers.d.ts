import * as http from 'node:http';
import { HandlerT } from './types.js';
export declare let callFunction: (fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>) => HandlerT;
export declare let permanentRedirectTo: (location: string) => HandlerT;
export declare let servePath: (docRoot: string, pathRegex: RegExp) => HandlerT;
