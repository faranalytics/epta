import * as fs from 'node:fs/promises';
import * as pth from 'node:path';
import { createHandler, accept, deny, logger as log } from 'wrighter';
import { errorTemplate } from './templates.js';
import { HTTP200Response, HTTP301Response, HTTP400Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
const http400Response = new HTTP400Response({ body: errorTemplate({ 'main': 'Bad Request' }) });
export let callFunction = createHandler(function callFunction(fn) {
    return async (req, res, url) => {
        await fn(req, res);
        return accept;
    };
});
export let permanentRedirectTo = createHandler(function permanentRedirectTo(location) {
    return async (req, res, url) => {
        return new HTTP301Response({ header: { 'location': location } });
    };
});
export let matchRequestFor = createHandler(function matchRequestFor(docRoot, mimeMap) {
    let mimeMapEntries = Object.entries(mimeMap);
    return async (req, res, url) => {
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
    };
});
export let requestListener = createHandler(function requestListener(fn, { handlers: { requestHandler = console.log, responseHandler = console.log, errorHandler = console.log }, et = errorTemplate }) {
    return async (req, res) => {
        try {
            requestHandler(req, res);
            res.addListener('close', () => {
                responseHandler(req, res);
            });
            let response;
            if (req.url) {
                let url = new URL(req.url, `${Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http'}://${req.headers.host}/`);
                response = await fn(req, res, url);
                console.log(response);
            }
            if (response === deny) {
                response = new HTTP404Response();
            }
            if (response instanceof HTTPResponse) {
                let body = response.text;
                console.log(errorTemplate);
                if (errorTemplate) {
                    body = errorTemplate({ 'error': response.body.toString('utf-8') });
                    console.log(body);
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
                log.error("The server produced an unknown error type; hence, shutting down.");
                throw e;
            }
        }
        return accept;
    };
});
