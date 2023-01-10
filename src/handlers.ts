import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny, logger as log } from 'wrighter';
import { errorTemplate } from './templates.js';
import { HandlerT, RequestListenerT, RouterT } from './types.js'
import { HTTP200Response, HTTP301Response, HTTP400Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
import { ActivatorT } from 'elemental-0';

const http400Response = new HTTP400Response({ body: errorTemplate({ 'main': 'Bad Request' }) });

export let callFunction = createHandler<[fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>], HandlerT>(function callFunction(fn) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        await fn(req, res);
        return accept;
    }
});

export let permanentRedirectTo = createHandler<[location: string], HandlerT>(function permanentRedirectTo(location) {
    return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
        return new HTTP301Response({ header: { 'location': location } });
    }
});

export let matchRequestFor = createHandler<[docRoot: string, mimeMap: { [key: string]: RegExp }], HandlerT>(
    function matchRequestFor(docRoot: string, mimeMap: { [key: string]: RegExp }
    ) {
        let mimeMapEntries = Object.entries(mimeMap);

        return async (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => {
            if (url instanceof URL) {
                if (url.pathname.indexOf('\0') !== -1) {
                    return http400Response;
                }

                let pathname = pth.normalize(url.pathname);
                for (let [mime, regex] of mimeMapEntries) {
                    if (regex.test(pathname)) {
                        let path = pth.join(docRoot, url.pathname);
                        if (path.indexOf(docRoot) !== 0) {
                            return http400Response;
                        }
                        let headers = { 'content-type': mime };
                        let buffer = await fs.readFile(path);
                        return new HTTP200Response({ body: buffer, header: headers });
                    }
                }
            }

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
    et?: ActivatorT;
    responseTimeout?: number;
}
export let requestListener = createHandler<[fn: RouterT | HandlerT, option: RequestListenerOptions], RequestListenerT>(
    function requestListener(
        fn: RouterT | HandlerT,
        {
            handlers: {
                requestHandler = console.log,
                responseHandler = console.log,
                errorHandler = console.log
            },
            et = errorTemplate
        }: RequestListenerOptions
    ) {

        return async (req: http.IncomingMessage, res: http.ServerResponse) => {

            try {
                requestHandler(req, res);

                res.addListener('close', () => {
                    responseHandler(req, res);
                })

                let response;

                if (req.url) {

                    let url = new URL(req.url, `${Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http'}://${req.headers.host}/`);

                    response = await fn(req, res, url);

                    console.log(response)
                }

                if (response === deny) {
                    response = new HTTP404Response();
                }

                if (response instanceof HTTPResponse) {
                    let body = response.text;
                    console.log(errorTemplate)
                    if (errorTemplate) {
                        body = errorTemplate({ 'error': response.body.toString('utf-8') });
                        console.log(body)
                    }
                    res.writeHead(response.code, { 'content-length': Buffer.byteLength(body) });
                    res.end(body);
                }
                else {
                    /* Close the connection using responseTimeout */
                }
            }
            catch (e) {
                if (e instanceof Error) {
                    let response = new HTTP500Response();
                    let body = response.text;
                    if (errorTemplate) {
                        body = errorTemplate({ 'error': body });
                    }
                    res.writeHead(response.code, { 'content-length': Buffer.byteLength(body) });
                    res.end(body);
                    errorHandler(req, res, e);
                }
                else {
                    log.error("The server produced an unknown error type; hence, shutting down.")
                    throw e;
                }
            }
            return accept;
        }
    });