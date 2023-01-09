/// <reference types="node" />
import * as http from 'node:http';
import { accept, deny } from 'wrighter';
import { HTTPResponse } from './http_responses';
export type RouterT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<HTTPResponse | typeof accept | typeof deny>;
export type HandlerT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<HTTPResponse | typeof accept | typeof deny>;
