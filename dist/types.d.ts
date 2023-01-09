/// <reference types="node" />
import * as http from 'node:http';
import { accept, deny } from 'wrighter';
export type RouterT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>;
export type HandlerT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>;
