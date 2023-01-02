import { HTTPResponse } from './http_responses.js';
import { createRoute, accept, deny } from 'wrighter';
export { createRoute, logger } from 'wrighter';
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
        return await fn(req, res, ctx);
    };
});
export let requestListener = createRoute(function requestListener(router, options) {
    return async (req, res) => {
        try {
            let scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            let url = `${scheme}://${req.headers.host}${req.url}`;
            let remoteAddress = `${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`;
            if (options.accessLog) {
                options.accessLog(`:${remoteAddress}:${req.method}:${url}`);
            }
            let result = await router(req, res, new Context());
            if (typeof result == 'string') {
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(result),
                    'Content-Type': 'text/html'
                });
                res.end(result);
            }
        }
        catch (e) {
            if (e instanceof HTTPResponse) {
                res.writeHead(e.code, {
                    'Content-Length': Buffer.byteLength(e.message),
                    'Content-Type': 'text/html'
                });
                res.end(e.message);
                options.accessLog(e.message);
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
