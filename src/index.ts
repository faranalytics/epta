import http from 'node:http';
import { accept, deny, logger as log } from 'wrighter';

export { createRoute, createHandler, logger as log } from 'wrighter';
export { logger } from 'wrighter';
export {
    matchHost,
    matchMethod,
    matchPath,
    matchSchemePort
} from './routes.js';

export {
    redirectTo,
    routeTo
} from './handlers.js';

export interface RequestListenerEvents {
    request: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    response: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    error: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}

export interface RequestListenerOptions {
    events: RequestListenerEvents;
    responseTimeout?: number;
}

export let createRequestListener = (
    router: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>,
    options: RequestListenerOptions = { events: { request: console.log, response: console.log, error: console.error } }
) => {

    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        let response: typeof accept | typeof deny;

        try {

            if (typeof options?.events?.request == 'function') {
                options.events.request(req, res);
            }

            res.addListener('close', () => {
                if (typeof options?.events?.response == 'function') {
                    options.events.response(req, res);
                }
            })

            response = await router(req, res);

            if (response === deny) {
                let body = 'Not Found';
                res.writeHead(404, { 'content-length': Buffer.byteLength(body) });
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
                if (typeof options?.events?.error == 'function') {
                    options.events.error(req, res, e);
                }
            }
            else {
                log.error("The server produced an unknown error type; hence, shutting down.")
                throw e;
            }
        }
    }
}
