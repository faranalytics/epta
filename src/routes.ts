import * as http from 'node:http';
import { createRoute, accept, deny } from 'wrighter';
import { RouterT, HandlerT } from './types.js';

export let matchSchemePort = createRoute<[scheme: 'http' | 'https', port: number], RouterT | HandlerT>(function matchSchemePort(scheme, port) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    }
});

export let matchHost = createRoute<[hostRegex: RegExp], RouterT | HandlerT>(function matchHost(hostRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        if (req.headers.host) {
            if (hostRegex.test(req.headers.host.replace(/^(.*?)(?::\d{1,}$|$)/, '$1'))) {
                return accept;
            }
        }
        res.statusCode = 400;
        return deny;
    }
});

export let matchMethod = createRoute<[methodRegex: RegExp], RouterT | HandlerT>(function matchMethod(methodRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        if (req.method && methodRegex.test(req.method)) {
            return accept;
        }
        res.statusCode = 405;
        return deny;
    }
});

export let matchPath = createRoute<[pathRegex: RegExp], RouterT | HandlerT>(function matchPath(pathRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        if (req.url) {
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            if (pathRegex.test(url.pathname)) {
                return accept
            }
        }
        res.statusCode = 404;
        return deny;
    }
});

