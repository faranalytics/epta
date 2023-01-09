import * as http from 'node:http';
import * as fs from 'node:fs';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { errorTemplate } from './templates.js';
import { HandlerT } from './types.js'
import { HTTP200Response, HTTP301Response, HTTP400Response, HTTP404Response } from './http_responses.js';

const http400Response = new HTTP400Response({ body: errorTemplate({ 'main': 'Bad Request' }) });

export let callFunction = createHandler<[fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>], HandlerT>(function callFunction(fn) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        await fn(req, res);
        return accept;
    }
});

export let permanentRedirectTo = createHandler<[location: string], HandlerT>(function permanentRedirectTo(location) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        return new HTTP301Response({header:{'location': location}});
    }
});

export let servePath = createHandler<[docRoot: string, pathRegex: RegExp], HandlerT>(function servePath(docRoot: string, pathRegex: RegExp) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
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


                return new HTTP200Response({body: pathname});
            }
        }

        return deny;
    }
});
