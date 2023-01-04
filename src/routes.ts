import * as http from 'node:http';
import { HTTP200Response, HTTP301Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
import { createRoute, accept, deny } from 'wrighter';

export { createRoute, logger as log } from 'wrighter';
export type ReturnT = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>;

export let matchSchemePort = createRoute<[scheme: 'http' | 'https', port: number], ReturnT>(function matchSchemePort(
    scheme,
    port
) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    }
});

export let matchHost = createRoute<[hostRegex: RegExp], ReturnT>(function matchHost(hostRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        if (req.headers.host) {
            return hostRegex.test(req.headers.host.replace(/^(.*?)(?::\d{1,}$|$)/, '$1')) ? accept : deny;
        }
        else {
            return deny
        }

    }
});

export let matchMethod = createRoute<[methodRegex: RegExp], ReturnT>(function matchMethod(methodRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        if (req.method) {
            return methodRegex.test(req.method) ? accept : deny;
        }
        return deny;
    }
});

export let matchPath = createRoute<[pathRegex: RegExp], ReturnT>(function matchPath(pathRegex) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        if (req.url) {
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            return pathRegex.test(url.pathname) ? accept : deny;
        }

        return deny;
    }
});

export let routeTo = createRoute<[
    (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>],
    ReturnT>(function routeTo(fn) {
        return async (req: http.IncomingMessage, res: http.ServerResponse) => {

            let result = await fn(req, res);

            if (result instanceof HTTPResponse) {
                return result;
            }
            else {
                return accept;
            }
        }
    });

export let redirectTo = createRoute<[location: string], ReturnT>(function redirectTo(location) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        return new HTTP301Response({ location: location });
    }
});

