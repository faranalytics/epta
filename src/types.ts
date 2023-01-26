import * as http from 'node:http';
import { accept, deny } from 'wrighter';

export type RouterT = (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<typeof accept | typeof deny>;
export type RequestListenerT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>;
export type HandlerT = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, url: URL, match: RegExpMatchArray) => Promise<any>;