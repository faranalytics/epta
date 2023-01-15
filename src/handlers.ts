import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { HandlerT, RequestListenerT, RouterT } from './types.js'
import { STATUS_CODES } from 'node:http';


export let matchAllTo = createHandler<[fn: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>], HandlerT>(function matchAllTo(fn) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        await fn(req, res, url);
        return accept;
    }
});

export let matchPathToRedirect = createHandler<[pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308], HandlerT>(function matchPathToRedirect(pathRegex, location, code) {
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

export let matchAllToDefaultResponse = createHandler<[code: number, body?: string], HandlerT>(function matchAllToDefaultResponse(code, body) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

        if (res.statusCode) {
            code = res.statusCode;
        }

        if (!body) {
            body = STATUS_CODES[code];
        }

        res.writeHead(
            code,
            { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
        ).end(body);
        return accept;
    }
});

export let matchPathToFileMediaType = createHandler<[docRoot: string, pathRegex: RegExp, mediaType: string], HandlerT>(
    function matchPathToFileMediaType(docRoot, pathRegex, mediaType
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
                        let buffer = await fs.readFile(path);
                        res.writeHead(
                            200,
                            {
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
        }
    });


export let matchPathToFile = createHandler<[docRoot: string, pathRegex: RegExp, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>], HandlerT>(
    function matchPathToFile(docRoot, pathRegex, handler
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
        }
    });

export let matchPathTo = createHandler<[pathRegex: RegExp, handler: (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<string>], HandlerT>(
    function matchPathTo(pathRegex, handler
    ) {

        return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {

            if (url instanceof URL) {

                if (url.pathname.indexOf('\0') !== -1) {
                    res.statusCode = 400;
                    return deny;
                }

                if (pathRegex.test(url.pathname)) {
                    try {

                        let body = await handler(req, res, url);

                        if (typeof body == 'string' && !res.writableEnded) {
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
        }
    });


export interface RequestListenerHandlers {
    requestHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    responseHandler: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    errorHandler: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}

export interface RequestListenerOptions {
    handlers: RequestListenerHandlers;
    responseTimeout?: number;
}

export let requestListener = createHandler<[fn: RouterT | HandlerT, option: RequestListenerOptions], RequestListenerT>(
    function requestListener(
        fn: RouterT | HandlerT,
        {
            handlers: {
                requestHandler = console.log,
                responseHandler = console.log,
                errorHandler = console.error
            }
        }: RequestListenerOptions
    ) {
        return async (req: http.IncomingMessage, res: http.ServerResponse) => {

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
                    let body = STATUS_CODES[500];
                    res.writeHead(
                        500,
                        { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
                    ).end(body);
                    errorHandler(req, res, e);
                }
                console.error(e);
            }
            return accept;
        }
    });