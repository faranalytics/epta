import * as http from 'node:http';
import { createTransformer, accept, deny } from 'wrighter';
export let createListener = createTransformer(function createListener({ requestHandler = console.log, responseHandler = console.log, errorHandler = console.error, responseTimeout = -1 }) {
    return async (forward, req, res) => {
        try {
            res.addListener('close', () => {
                responseHandler(req, res);
            });
            requestHandler(req, res);
            if (req.url) {
                let url = new URL(req.url, `${Object.hasOwn(req.socket, 'encrypted') ? 'https' : 'http'}://${req.headers.host}/`);
                let result = await forward(req, res, url);
                if (result !== accept) {
                    throw new Error("Failed to route request; add a default route.");
                }
                return result;
            }
            return deny;
        }
        catch (e) {
            if (e instanceof Error) {
                let body = http.STATUS_CODES[500];
                res.writeHead(500, { 'content-length': body ? body.length : 0, 'content-type': 'text/html' }).end(body);
                errorHandler(req, res, e);
            }
            else {
                console.error(e);
            }
        }
        return accept;
    };
});
