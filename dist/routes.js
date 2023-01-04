import { HTTP301Response, HTTPResponse } from './http_responses.js';
import { createRoute, accept, deny } from 'wrighter';
export { createRoute, logger as log } from 'wrighter';
export let matchSchemePort = createRoute(function matchSchemePort(scheme, port) {
    return async (req, res) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    };
});
export let matchHost = createRoute(function matchHost(hostRegex) {
    return async (req, res) => {
        if (req.headers.host) {
            return hostRegex.test(req.headers.host.replace(/^(.*?)(?::\d{1,}$|$)/, '$1')) ? accept : deny;
        }
        else {
            return deny;
        }
    };
});
export let matchMethod = createRoute(function matchMethod(methodRegex) {
    return async (req, res) => {
        if (req.method) {
            return methodRegex.test(req.method) ? accept : deny;
        }
        return deny;
    };
});
export let matchPath = createRoute(function matchPath(pathRegex) {
    return async (req, res) => {
        if (req.url) {
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            return pathRegex.test(url.pathname) ? accept : deny;
        }
        return deny;
    };
});
export let routeTo = createRoute(function routeTo(fn) {
    return async (req, res) => {
        let result = await fn(req, res);
        if (result instanceof HTTPResponse) {
            return result;
        }
        else {
            return accept;
        }
    };
});
export let redirectTo = createRoute(function redirectTo(location) {
    return async (req, res) => {
        return new HTTP301Response({ location: location });
    };
});
