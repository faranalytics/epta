import { Context } from './routes.js';
import { accept } from 'wrighter';
import { HTTPResponse } from './http_responses.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo, Context } from './routes.js';
export let createRequestListener = (router, options) => {
    return async (req, res) => {
        let ctx = new Context();
        try {
            if (typeof options.events.request == 'function') {
                options.events.request(req, res, ctx);
            }
            let result = await router(req, res, ctx);
            if (result == accept) {
                /*This happens when a handler handles a request on its own.  If the routing result is `accept` then the connection should be closed according to a timeout in the event that the handler doesn't handle the request within a specified amount of time.*/
                if (typeof options.events.response == 'function') {
                    options.events.response(req, res, ctx);
                }
            }
            else if (result instanceof HTTPResponse) {
                let body = result.body ? result.body : result.text;
                if (result.header) {
                    let keys = Object.keys(result.header);
                    for (let i = 0; i < keys.length; i++) {
                        let key = keys[i].toLowerCase();
                        if (key !== keys[i]) {
                            result.header[key] = result.header[keys[i]];
                            delete result.header[keys[i]];
                        }
                        res.setHeader(key, result.header[key]);
                    }
                }
                if (!result.header || !result.header['content-type']) {
                    /* Content negotiation */
                }
                res.writeHead(result.code, {
                    'Content-Length': Buffer.byteLength(body),
                    'Content-Type': 'text/html'
                });
                res.end(body);
                if (typeof options.events.response == 'function') {
                    options.events.response(req, res, ctx, result);
                }
            }
            else {
                let body = 'Not Found';
                // Inject the body into a default template.
                res.writeHead(404, {
                    'Content-Length': Buffer.byteLength(body),
                    'Content-Type': 'text/html'
                });
                res.end(body);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                let text = 'Internal Server Error';
                res.writeHead(500, {
                    'Content-Length': Buffer.byteLength(text),
                    'Content-Type': 'text/html'
                });
                res.end(text);
                if (typeof options.events.error == 'function') {
                    options.events.error(req, res, ctx, e);
                }
            }
            else {
                throw e;
            }
        }
    };
};
