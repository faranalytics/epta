import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { HandlerT, RequestListenerT, RouterT } from './types.js'

export let matchPathToHTTPRedirect = createHandler<[pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308], HandlerT>(function matchPathToHTTPRedirect(pathRegex, location, code) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
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
    }
});

export let matchAllToDefaultHTTPResponse = createHandler<[code: number, body?: string], HandlerT>(function matchAllToDefaultHTTPResponse(code, body) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

        if (res.statusCode) {
            code = res.statusCode;
        }

        if (!body) {
            body = http.STATUS_CODES[code];
        }

        res.writeHead(
            code,
            { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
        ).end(body);

        return accept;
    }
});

export let matchAllToHTTPResponse = createHandler<[code: number, body?: string], HandlerT>(function matchAllToHTTPResponse(code, body) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

        if (!body) {
            body = http.STATUS_CODES[code];
        }

        res.writeHead(
            code,
            { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
        ).end(body);

        return accept;
    }
});


export let matchPathToMediaType = createHandler<[pathRegex: RegExp, docRoot: string, mediaType: string], HandlerT>(
    function matchPathToMediaType(pathRegex, docRoot, mediaType
    ) {
        return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
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
                        let stat = await fs.stat(path);
                        if (stat.isFile()) {
                            let buffer = await fs.readFile(path);
                            res.writeHead(
                                200,
                                {
                                    'content-length': buffer.length,
                                    'content-type': mediaType
                                }).end(buffer);
                            return accept;
                        }
                        res.statusCode = 404;
                        return deny;
                    }
                    catch (e) {
                        res.statusCode = 404;
                        return deny;
                    }

                }
            }

            res.statusCode = 404;
            return deny;
        }
    });

export let matchPathToHandler = createHandler<[pathRegexes: Array<RegExp>, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<string | Buffer>, mediaType: string], HandlerT>(function matchPathToHandler(pathRegexes, handler, mediaType) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

        if (url instanceof URL) {

            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }

            for (let regex of pathRegexes) {
                if (regex.test(url.pathname)) {

                    res.setHeader('content-type', mediaType);

                    let body = await handler(req, res, url);

                    if ((typeof body == 'string' || body instanceof Buffer) && !res.writableEnded) {
                        res.writeHead(200, { 'content-length': Buffer.byteLength(body) });
                        res.end(body);
                    }

                    return accept;
                }
            }
        }

        res.statusCode = 404;
        return deny;
    }
});