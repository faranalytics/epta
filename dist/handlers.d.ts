import * as http from 'node:http';
import { HandlerT } from './types.js';
export declare let matchPathToHTTPRedirect: (pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308) => HandlerT;
export declare let matchAllToDefaultHTTPResponse: (code: number, body?: string | undefined) => HandlerT;
export declare let matchAllToHTTPResponse: (code: number, body?: string | undefined) => HandlerT;
export declare let matchPathToMediaType: (pathRegex: RegExp, docRoot: string, mediaType: string) => HandlerT;
export declare let matchPathToHandler: (pathRegexes: RegExp[], handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<string | Buffer>, mediaType: string) => HandlerT;
