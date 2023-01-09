import { deny, logger as log } from 'wrighter';
import { HTTP404Response, HTTPResponse } from './http_responses.js';
export { createRoute, createHandler, logger as log } from 'wrighter';
export { logger } from 'wrighter';
export * from './routes.js';
export * from './handlers.js';
export let createRequestListener = (router, { handlers: { requestHandler = console.log, responseHandler = console.log, errorHandler = console.error } }) => {
    return async (req, res) => {
        try {
            requestHandler(req, res);
            res.addListener('close', () => {
                responseHandler(req, res);
            });
            let response = await router(req, res);
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
        catch (e) {
            if (e instanceof Error) {
                let body = 'Not Found';
                res.writeHead(404, { 'content-length': Buffer.byteLength(body) });
                res.end(body);
                errorHandler(req, res, e);
            }
            else {
                log.error("The server produced an unknown error type; hence, shutting down.");
                throw e;
            }
        }
    };
};
