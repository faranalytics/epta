import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny, logger as log } from 'wrighter';
import { errorTemplate } from './templates.js';
import { HandlerT, RequestListenerT, RouterT } from './types.js'
import { ActivatorT } from 'elemental-0';
import { STATUS_CODES } from 'node:http';


export let callFunction = createHandler<[fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<typeof accept | typeof deny>], HandlerT>(function callFunction(fn) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        return await fn(req, res);
    }
});

export let permanentRedirectTo = createHandler<[location: string], HandlerT>(function permanentRedirectTo(location) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        res.writeHead(301, { 'location': location });
        return accept;
    }
});

export let defaultRoute = createHandler<[code: number, template?: ActivatorT], HandlerT>(function defaultRoute(code, template) {

    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        if (res.statusCode) {
            code = res.statusCode;
        }
        let body = STATUS_CODES[code];
        res.writeHead(
            code,
            { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
        ).end(template ? template({ 'http-response': body ? body : '' }) : body);
        return accept;
    }
});

export let matchMediaType = createHandler<[docRoot: string, mimeMap: { [key: string]: RegExp }, template?: ActivatorT], HandlerT>(
    function matchMediaType(docRoot: string, mimeMap: { [key: string]: RegExp }, template
    ) {
        let mimeMapEntries = Object.entries(mimeMap);

        return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
            if (url instanceof URL) {

                if (url.pathname.indexOf('\0') !== -1) {
                    let body = STATUS_CODES[400];
                    res.writeHead(
                        400,
                        { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
                    ).end(template ? template({ 'http-response': body ? body : '' }) : body);
                    return accept;
                }

                let pathname = pth.normalize(url.pathname);
                for (let [mime, regex] of mimeMapEntries) {
                    if (regex.test(pathname)) {
                        let path = pth.join(docRoot, pathname);
                        if (path.indexOf(docRoot) !== 0) {
                            res.statusCode = 404;
                            return deny;
                        }
                        let buffer = await fs.readFile(path);
                        res.writeHead(200, STATUS_CODES[200],
                            {
                                'content-length': buffer.length,
                                'content-type': mime
                            }).end(buffer);
                        return accept;
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
    template?: ActivatorT;
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
            },
            template = errorTemplate
        }: RequestListenerOptions
    ) {
        return async (req: http.IncomingMessage, res: http.ServerResponse) => {

            try {
                requestHandler(req, res);

                res.addListener('close', () => {
                    responseHandler(req, res);
                })

                if (req.url) {
                    let url = new URL(req.url, `${Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http'}://${req.headers.host}/`);

                    let response = await fn(req, res, url);

                    if (response !== accept) {
                        throw new Error("Failed to route request; add a default route.");
                    }
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    let body = STATUS_CODES[500];
                    res.writeHead(
                        500,
                        { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }
                    ).end(template ? template({ 'http-response': body ? body : '' }) : body);
                    errorHandler(req, res, e);
                }
                console.error(e);
            }
            return accept;
        }
    });