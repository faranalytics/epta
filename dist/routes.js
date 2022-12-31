export { createRoute } from 'wrighter';
import { HTTP404Response, HTTPResponse } from './http_responses.js';
import { logger as log } from 'memoir';
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
export function httpAdapter(router) {
    return async function (req, res) {
        try {
            let result = await router(req, res, new Context());
            if (result === false) {
                throw new HTTP404Response();
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
                    log.debug(e.stack ? e.stack : e.message);
                }
            }
        }
    };
}
export let logRequest = createRoute(function logRequest(req, res, ctx, log) {
    let scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
    log(`${scheme}://${req.headers.host}${req.url}`);
    return true;
});
export let matchSchemePort = createRoute(function matchSchemePort(req, res, ctx, scheme, port) {
    if (req.url) {
        let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
        let url = new URL(req.url, `${_scheme}://${req.headers.host}`);
        ctx.url = url;
        return scheme === _scheme && port === req.socket.localPort;
    }
    return false;
});
export let matchHost = createRoute(function matchHost(req, res, ctx, hostRegex) {
    if (req.url) {
        let url = new URL(req.url, `${ctx['scheme']}://${req.headers.host}`);
        ctx['url'] = url;
        return hostRegex.test(url.hostname);
    }
    return false;
});
export let matchMethod = createRoute(function matchMethod(req, res, ctx, methodRegex) {
    if (req.method) {
        return methodRegex.test(req.method);
    }
    return false;
});
export let matchPath = createRoute(function matchPath(req, res, ctx, pathRegex) {
    if (ctx?.url?.pathname) {
        return pathRegex.test(ctx.url.pathname);
    }
    return false;
});
export let routeTo = createRoute(function routeTo(req, res, ctx, fn) {
    fn(req, res, ctx);
    return null;
});
