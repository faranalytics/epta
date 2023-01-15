import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
export let matchAllTo = createHandler(function matchAllTo(fn) {
    return async (req, res, url) => {
        await fn(req, res, url);
        return accept;
    };
});
export let matchPathToRedirect = createHandler(function matchPathToRedirect(pathRegex, location, code) {
    return async (req, res, url) => {
        if (url instanceof URL) {
            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }
            if (pathRegex.test(url.pathname)) {
                res.writeHead(code, { 'location': location, 'content-length': 0 }).end();
                return accept;
            }
        }
        res.statusCode = 400;
        return deny;
    };
});
export let matchAllToDefaultResponse = createHandler(function matchAllToDefaultResponse(code, body) {
    return async (req, res, url) => {
        if (res.statusCode) {
            code = res.statusCode;
        }
        if (!body) {
            body = http.STATUS_CODES[code];
        }
        res.writeHead(code, { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }).end(body);
        return accept;
    };
});
export let matchAllToResponse = createHandler(function matchAllToResponse(code, body) {
    return async (req, res, url) => {
        if (!body) {
            body = http.STATUS_CODES[code];
        }
        res.writeHead(code, { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }).end(body);
        return accept;
    };
});
export let matchPathToFileMediaType = createHandler(function matchPathToFileMediaType(docRoot, pathRegex, mediaType) {
    return async (req, res, url) => {
        if (url instanceof URL) {
            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }
            if (pathRegex.test(url.pathname)) {
                let path = pth.join(docRoot, url.pathname);
                if (path.indexOf(docRoot) !== 0) {
                    res.statusCode = 404;
                    return deny;
                }
                try {
                    let buffer = await fs.readFile(path);
                    res.writeHead(200, {
                        'content-length': buffer.length,
                        'content-type': mediaType
                    }).end(buffer);
                    return accept;
                }
                catch (e) {
                    res.statusCode = 404;
                    return deny;
                }
            }
        }
        res.statusCode = 404;
        return deny;
    };
});
export let matchPathToMediaTypeCall = createHandler(function matchPathToMediaTypeCall(handler, pathRegex, mediaType) {
    return async (req, res, url) => {
        if (url instanceof URL) {
            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }
            if (pathRegex.test(url.pathname)) {
                try {
                    res.setHeader('content-type', mediaType);
                    let body = await handler(req, res, url);
                    if ((typeof body == 'string' || body instanceof Buffer) && !res.writableEnded) {
                        res.writeHead(200, { 'content-length': Buffer.byteLength(body) });
                        res.end(body);
                        return accept;
                    }
                    else if (res.writableEnded) {
                        return accept;
                    }
                    else {
                        res.statusCode = 404;
                        return deny;
                    }
                }
                catch (e) {
                    res.statusCode = 404;
                    return deny;
                }
            }
        }
        res.statusCode = 404;
        return deny;
    };
});
export let matchPathToCall = createHandler(function matchPathToCall(pathRegex, handler) {
    return async (req, res, url) => {
        if (url instanceof URL) {
            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }
            if (pathRegex.test(url.pathname)) {
                try {
                    await handler(req, res, url);
                    return accept;
                }
                catch (e) {
                    res.statusCode = 404;
                    return deny;
                }
            }
        }
        res.statusCode = 404;
        return deny;
    };
});
export let requestListener = createHandler(function requestListener(fn, { handlers: { requestHandler = console.log, responseHandler = console.log, errorHandler = console.error } }) {
    return async (req, res) => {
        try {
            requestHandler(req, res);
            res.addListener('close', () => {
                responseHandler(req, res);
            });
            if (req.url) {
                let url = new URL(req.url, `${Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http'}://${req.headers.host}/`);
                let response = await fn(req, res, url);
                if (response !== accept) {
                    throw new Error("Failed to route request; add a default route - perhaps.");
                }
            }
        }
        catch (e) {
            if (e instanceof Error) {
                let body = http.STATUS_CODES[500];
                res.writeHead(500, { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }).end(body);
                errorHandler(req, res, e);
            }
            console.error(e);
        }
        return accept;
    };
});
