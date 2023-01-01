export { createRoute } from 'wrighter';
import { HTTP404Response, HTTPResponse } from './http_responses.js';
import { createRoute } from 'wrighter';
export class Context {
    toString() {
        try {
            return JSON.stringify(this);
        }
        catch (e) {
            return '[object Object]';
        }
    }
}
export let logRequestTo = createRoute(function logRequestTo(log, formatter) {
    return async (req, res, ctx) => {
        let scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
        let url = `${scheme}://${req.headers.host}${req.url}`;
        let remoteAddress = `${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`;
        if (formatter) {
            log(formatter(remoteAddress, req.method, url));
        }
        else {
            log(`:${remoteAddress}:${req.method}:${url}`);
        }
        return true;
    };
});
export let matchSchemePort = createRoute(function matchSchemePort(scheme, port) {
    return async (req, res, ctx) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            let url = new URL(req.url, `${_scheme}://${req.headers.host}`);
            ctx.url = url;
            return scheme === _scheme && port === req.socket.localPort;
        }
        return false;
    };
});
export let matchHost = createRoute(function matchHost(hostRegex) {
    return async (req, res, ctx) => {
        if (req.url) {
            let url = new URL(req.url, `${ctx['scheme']}://${req.headers.host}`);
            ctx['url'] = url;
            return hostRegex.test(url.hostname);
        }
        return false;
    };
});
export let matchMethod = createRoute(function matchMethod(methodRegex) {
    return async (req, res, ctx) => {
        if (req.method) {
            return methodRegex.test(req.method);
        }
        return false;
    };
});
export let matchPath = createRoute(function matchPath(pathRegex) {
    return async (req, res, ctx) => {
        if (ctx?.url?.pathname) {
            return pathRegex.test(ctx.url.pathname);
        }
        return false;
    };
});
export let routeTo = createRoute(function routeTo(fn) {
    return async (req, res, ctx) => {
        let result = fn(req, res, ctx);
        if (typeof result == 'boolean') {
            return result;
        }
        else {
            return null;
        }
    };
});
export let requestListener = createRoute(function requestListener(router, options) {
    return async (req, res) => {
        try {
            let result = await router(req, res, new Context());
            if (result === false) {
                throw new HTTP404Response();
            }
            else if (result === true) {
                return true;
            }
            else {
                return null;
            }
        }
        catch (e) {
            if (e instanceof HTTPResponse) {
                res.writeHead(e.code, {
                    'Content-Length': Buffer.byteLength(e.message),
                    'Content-Type': 'text/html'
                });
                res.end(e.message);
            }
            else {
                let message = 'Internal Server Error';
                res.writeHead(500, {
                    'Content-Length': Buffer.byteLength(message),
                    'Content-Type': 'text/html'
                });
                res.end(message);
                if (e instanceof Error) {
                    options.errorLog(e.stack ? e.stack : e.message);
                }
            }
        }
    };
});
