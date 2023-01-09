import * as http from 'node:http';
import { HandlerT } from './types.js';
export declare let routeTo: (fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>) => HandlerT;
export declare let redirectTo: (location: string) => HandlerT;
export declare let matchFileResource: (docRoot: string, fileNameRegex: RegExp) => HandlerT;
