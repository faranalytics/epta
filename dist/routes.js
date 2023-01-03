import { HTTP301Response, HTTPResponse } from './http_responses.js';
import { createRoute, accept, deny } from 'wrighter';
export { createRoute, logger as log } from 'wrighter';
export class Context {
    url;
    toString() {
        try {
            return JSON.stringify(this);
        }
        catch (e) {
            return '[object Object]';
        }
    }
}
export let matchSchemePort = createRoute(function matchSchemePort(scheme, port) {
    return async (req, res, ctx) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            let url = new URL(req.url, `${_scheme}://${req.headers.host}`);
            ctx.url = url;
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    };
});
export let matchHost = createRoute(function matchHost(hostRegex) {
    return async (req, res, ctx) => {
        if (req.url) {
            let url = new URL(req.url, `${ctx['scheme']}://${req.headers.host}`);
            ctx['url'] = url;
            return hostRegex.test(url.hostname) ? accept : deny;
        }
        return deny;
    };
});
export let matchMethod = createRoute(function matchMethod(methodRegex) {
    return async (req, res, ctx) => {
        if (req.method) {
            return methodRegex.test(req.method) ? accept : deny;
        }
        return deny;
    };
});
export let matchPath = createRoute(function matchPath(pathRegex) {
    return async (req, res, ctx) => {
        if (ctx?.url?.pathname) {
            return pathRegex.test(ctx.url.pathname) ? accept : deny;
        }
        return deny;
    };
});
export let routeTo = createRoute(function routeTo(fn) {
    return async (req, res, ctx) => {
        let result = await fn(req, res, ctx);
        if (result instanceof HTTPResponse) {
            return result;
        }
        else {
            return accept;
        }
    };
});
export let redirectTo = createRoute(function redirectTo(location) {
    return async (req, res, ctx) => {
        return new HTTP301Response({ location: location });
    };
});
export let requestListener = createRoute(function requestListener(router, options) {
    return async (req, res, ctx = new Context()) => {
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
                let body = '404 Not Found';
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
});
