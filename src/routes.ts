import * as http from 'node:http';
import { createRoute, accept, deny } from 'wrighter';
import { RouterT } from './types.js';

export let matchSchemePort = createRoute<[scheme: 'http' | 'https', port: number], RouterT>(function matchSchemePort(scheme, port) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    }
});

export let matchHost = createRoute<[hostRegex: RegExp], RouterT>(function matchHost(hostRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.headers.host) {
            return hostRegex.test(req.headers.host.replace(/^(.*?)(?::\d{1,}$|$)/, '$1')) ? accept : deny;
        }
        else {
            return deny
        }
    }
});

export let matchMethod = createRoute<[methodRegex: RegExp], RouterT>(function matchMethod(methodRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.method) {
            return methodRegex.test(req.method) ? accept : deny;
        }
        return deny;
    }
});

export let matchPath = createRoute<[pathRegex: RegExp], RouterT>(function matchPath(pathRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        if (req.url) {
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            return pathRegex.test(url.pathname) ? accept : deny;
        }
        return deny;
    }
});

