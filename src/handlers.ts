import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { RouterT, HandlerT } from './types.js';

export let matchPathToHTTPRedirect = createHandler<[pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308], RouterT>(function matchPathToHTTPRedirect(pathRegex, location, code) {
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

export let matchAllToDefaultHTTPResponse = createHandler<[code: number, body?: string], RouterT>(function matchAllToDefaultHTTPResponse(code, body) {

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

export let matchAllToHTTPResponse = createHandler<[code: number, body?: string], RouterT>(function matchAllToHTTPResponse(code, body) {

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


export let matchExtensionToMediaType = createHandler<[
    mediaTypeExtension: { [mediaType: string]: RegExp },
    docRoot: string
], RouterT>(
    function matchExtensionToMediaType(mediaTypeExtension, docRoot
    ) {
        return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
            if (url instanceof URL) {

                if (url.pathname.indexOf('\0') !== -1) {
                    res.statusCode = 400;
                    return deny;
                }

                for (let [mediaType, ext] of Object.entries(mediaTypeExtension)) {

                    if (ext.test(url.pathname)) {
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
            }
            res.statusCode = 404;
            return deny;
        }
    });

export let matchPathToDefaultExportHandler = createHandler<[pathRegex: RegExp, module: Promise<{ default: HandlerT }>], RouterT>(function matchPathToDefaultExportHandler(pathRegex, module) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

        let handler = (await module).default;

        if (url instanceof URL) {

            if (url.pathname.indexOf('\0') !== -1) {
                res.statusCode = 400;
                return deny;
            }

            let match = url.pathname.match(pathRegex)

            if (match) {
                return await handler(req, res, url, match);
            }
        }
        res.statusCode = 404;
        return deny;
    }
});