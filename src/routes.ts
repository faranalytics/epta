export { createRoute } from 'wrighter';
import * as http from 'node:http';
import { HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
import { logger as log } from 'memoir';
import { createRoute } from 'wrighter';

export class Context {

    [key: string]: any;

    toString() {
        try {
            return JSON.stringify(this);
        }
        catch (e) {
            return '[object Object]';
        }
    }
}

type T = [
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context
]

export function httpAdapter(router: (...args: T) => Promise<boolean | void | null>) {

    return async function (req: http.IncomingMessage, res: http.ServerResponse) {

        try {
            let result = await router(req, res, new Context());

            if (result === false) {
                throw new HTTP404Response();
            }
        }
        catch (e: unknown) {

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
    }
}

export let logRequest = createRoute<T, [log: (message: string) => void]>(function logRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    log: (message: any) => void
) {
    let scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
    log(`${scheme}://${req.headers.host}${req.url}`);
    return true;
});

export let matchSchemePort = createRoute<T, [scheme: string, port: number]>(function matchSchemePort(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    scheme: string,
    port: number
) {
    if (req.url) {
        let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
        let url = new URL(req.url, `${_scheme}://${req.headers.host}`);
        ctx.url = url;
        return scheme === _scheme && port === req.socket.localPort;
    }
    return false;
});

export let matchHost = createRoute<T, [hostRegex: RegExp]>(function matchHost(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    hostRegex: RegExp) {
    if (req.url) {
        let url = new URL(req.url, `${ctx['scheme']}://${req.headers.host}`);
        ctx['url'] = url;
        return hostRegex.test(url.hostname);
    }
    return false;
});

export let matchMethod = createRoute<T, [methodRegex: RegExp]>(function matchMethod(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    methodRegex: RegExp
) {
    if (req.method) {
        return methodRegex.test(req.method);
    }
    return false;
});

export let matchPath = createRoute<T, [pathRegex: RegExp]>(function matchPath(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    pathRegex: RegExp
) {
    if (ctx?.url?.pathname) {
        return pathRegex.test(ctx.url.pathname);
    }
    return false;
});

export let routeTo = createRoute<T, [(...args: T) => void]>(function routeTo(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ctx: Context,
    fn: (...args: T) => void
) {
    fn(req, res, ctx);
    return null;
});