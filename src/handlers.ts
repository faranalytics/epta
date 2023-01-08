import * as http from 'node:http';
import * as fs from 'node:fs';
import * as pth from 'node:path';
import { createHandler, accept, deny } from 'wrighter';
import { RouteT } from './types.js'

export let routeTo = createHandler<[fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>], RouteT>(function routeTo(fn) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        await fn(req, res);
        return accept;
    }
});

export let redirectTo = createHandler<[location: string], RouteT>(function redirectTo(location) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {
        return accept;
    }
});

export let matchFileResource = createHandler<[docRoot: string, fileNameRegex: RegExp], RouteT>(function matchFileResource(doc_root: string, fileNameRegex: RegExp) {
    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        // // fs.createReadStream('tmp/test.txt', {encoding: 'utf8'});
        // if (req.url) {
        //     let url = new URL(req.url, `scheme://${req.headers.host}/`);
        //     console.log(url);
        //     let path = pth.join(doc_root, url.pathname);
        // }

        return deny;
    }
});
