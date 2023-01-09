import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { errorTemplate } from './templates.js';
import { HTTP200Response, HTTP301Response, HTTP400Response } from './http_responses.js';
const http400Response = new HTTP400Response({ body: errorTemplate({ 'main': 'Bad Request' }) });
export let callFunction = createHandler(function callFunction(fn) {
    return async (req, res) => {
        await fn(req, res);
        return accept;
    };
});
export let permanentRedirectTo = createHandler(function permanentRedirectTo(location) {
    return async (req, res) => {
        return new HTTP301Response({ header: { 'location': location } });
    };
});
export let servePath = createHandler(function servePath(docRoot, pathRegex) {
    return async (req, res) => {
        if (req.url) {
            if (req.url.indexOf('\0') !== -1) {
                return http400Response;
            }
            let url = new URL(req.url, `scheme://${req.headers.host}/`);
            let pathname = pth.normalize(url.pathname);
            if (pathRegex.test(pathname)) {
                let path = pth.join(docRoot, url.pathname);
                if (path.indexOf(docRoot) !== 0) {
                    return http400Response;
                }
                return new HTTP200Response({ body: pathname });
            }
        }
        return deny;
    };
});
