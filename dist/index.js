import { accept } from 'wrighter';
import { HTTPResponse } from './http_responses.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo } from './routes.js';
export let createRequestListener = (router, options) => {
    return async (req, res) => {
        let code = 500;
        let header = {};
        let body = '';
        let result;
        try {
            if (typeof options?.events?.request == 'function') {
                options.events.request(req, res);
            }
            result = await router(req, res);
            if (result instanceof HTTPResponse) {
                code = result.code;
                body = result.body ? result.body : result.text;
                header = result.header ? result.header : {};
            }
            else {
                code = 404;
                body = 'Not Found';
                header = {};
            }
        }
        catch (e) {
            if (e instanceof Error) {
                code = 500;
                header = {};
                body = 'Internal Server Error';
                if (typeof options?.events?.error == 'function') {
                    options.events.error(req, res, e);
                }
            }
        }
        finally {
            if (result == accept) {
                /*This happens when a handler handles a request on its own.  If the routing result is `accept` then the connection should be closed according to a timeout in the event that the handler doesn't handle the request within a specified amount of time.*/
            }
            else {
                header['content-length'] = Buffer.byteLength(body);
                res.writeHead(code, header);
                res.end(body);
                if (typeof options?.events?.response == 'function') {
                    options.events.response(req, res, result);
                }
            }
        }
    };
};
