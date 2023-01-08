/// <reference types="node" />
import * as http from 'node:http';
import { accept, deny } from 'wrighter';
export type RouteT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>;
