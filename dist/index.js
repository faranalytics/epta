import { deny } from 'wrighter';
import { HTTP500Response, HTTP404Response, HTTPResponse } from './http_responses.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo } from './routes.js';
export let createRequestListener = (router, options) => {
    return async (req, res) => {
        let response = null;
        try {
            if (typeof options?.events?.request == 'function') {
                options.events.request(req, res);
            }
            response = await router(req, res);
            if (response === deny) {
                response = new HTTP404Response();
            }
        }
        catch (e) {
            if (e instanceof Error) {
                response = new HTTP500Response();
                if (typeof options?.events?.error == 'function') {
                    options.events.error(req, res, e);
                }
            }
        }
        finally {
            if (response instanceof HTTPResponse) {
                let header = response.header;
                let body = response.body ? response.body : response.text;
                response.header['content-length'] = Buffer.byteLength(body);
                res.writeHead(response.code, header);
                res.end(body);
                if (typeof options?.events?.response == 'function') {
                    options.events.response(req, res, response);
                }
            }
            else {
                /* timeout */
            }
        }
    };
};
