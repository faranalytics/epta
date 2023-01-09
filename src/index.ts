import http from 'node:http';
import { accept, deny, logger as log } from 'wrighter';
import { HTTP404Response, HTTPResponse } from './http_responses.js';
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

export let createRequestListener = (
    router: RouterT | HandlerT,
    { handlers: { requestHandler = console.log, responseHandler = console.log, errorHandler = console.error } }: RequestListenerOptions
) => {

    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        try {

            requestHandler(req, res);

            res.addListener('close', () => {
                responseHandler(req, res);
            })

            let response: HTTPResponse | typeof deny | typeof accept = await router(req, res);

            if (response === deny) {
                response = new HTTP404Response();
            }

            if (response instanceof HTTPResponse) {
                let body = response.body;
                res.writeHead(response.code, { 'content-length': Buffer.byteLength(body) });
                res.end(body);
            }
            else {
                /* Close the connection using responseTimeout */
            }
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                let body = 'Not Found';
                res.writeHead(404, { 'content-length': Buffer.byteLength(body) });
                res.end(body);
                errorHandler(req, res, e);
            }
            else {
                log.error("The server produced an unknown error type; hence, shutting down.")
                throw e;
            }
        }
    }
}
