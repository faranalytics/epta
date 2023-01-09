/// <reference types="node" />
import http from 'node:http';
import { RouterT, HandlerT } from './types.js';
export { createRoute, createHandler, logger as log } from 'wrighter';
export { logger } from 'wrighter';
export * from './routes.js';
export * from './handlers.js';
export interface RequestListenerHandlers {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    responseHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    errorHandler: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}
export interface RequestListenerOptions {
    handlers: RequestListenerHandlers;
    responseTimeout?: number;
}
export declare let createRequestListener: (router: RouterT | HandlerT, { handlers: { requestHandler, responseHandler, errorHandler } }: RequestListenerOptions) => (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
