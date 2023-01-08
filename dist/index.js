import { deny, logger as log } from 'wrighter';
export { createRoute, createHandler, logger as log } from 'wrighter';
export { logger } from 'wrighter';
export { matchHost, matchMethod, matchPath, matchSchemePort } from './routes.js';
export { redirectTo, routeTo } from './handlers.js';
export let createRequestListener = (router, options = { events: { request: console.log, response: console.log, error: console.error } }) => {
    return async (req, res) => {
        let response;
        try {
            if (typeof options?.events?.request == 'function') {
                options.events.request(req, res);
            }
            res.addListener('close', () => {
                if (typeof options?.events?.response == 'function') {
                    options.events.response(req, res);
                }
            });
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
        catch (e) {
            if (e instanceof Error) {
                let body = 'Not Found';
                res.writeHead(404, { 'content-length': Buffer.byteLength(body) });
                res.end(body);
                if (typeof options?.events?.error == 'function') {
                    options.events.error(req, res, e);
                }
            }
            else {
                log.error("The server produced an unknown error type; hence, shutting down.");
                throw e;
            }
        }
    };
};
