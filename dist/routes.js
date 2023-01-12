import { createRoute, accept, deny } from 'wrighter';
export let matchSchemePort = createRoute(function matchSchemePort(scheme, port) {
    return async (req, res, url) => {
        if (req.url) {
            let _scheme = Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http';
            return scheme === _scheme && port === req.socket.localPort ? accept : deny;
        }
        return deny;
    };
});
export let matchHost = createRoute(function matchHost(hostRegex) {
    return async (req, res, url) => {
        if (req.headers.host) {
            if (hostRegex.test(req.headers.host.replace(/^(.*?)(?::\d{1,}$|$)/, '$1'))) {
                return accept;
            }
        }
        res.statusCode = 400;
        return deny;
    };
});
export let matchMethod = createRoute(function matchMethod(methodRegex) {
    return async (req, res, url) => {
        if (req.method && methodRegex.test(req.method)) {
            return accept;
        }
        res.statusCode = 405;
        return deny;
    };
});
export let matchPath = createRoute(function matchPath(pathRegex) {
    return async (req, res, url) => {
        if (req.url) {
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            if (pathRegex.test(url.pathname)) {
                return accept;
            }
        }
        res.statusCode = 404;
        return deny;
    };
});
