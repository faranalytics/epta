import * as http from 'node:http';
import { HTTP404Response, HTTPResponse } from './http_responses.js';
export class HTTPServer {
    router;
    constructor(options, router) {
        this.router = router;
        let server = new http.Server().listen(options);
        server.addListener('request', this.request.bind(this));
    }
    async request(req, res) {
        try {
            let result = await this.router(req, res, {});
            if (result === false) {
                throw new HTTP404Response();
            }
        }
        catch (e) {
            if (e instanceof HTTPResponse) {
                res.writeHead(e.code, {
                    'Content-Length': Buffer.byteLength(e.message),
                    'Content-Type': 'text/html'
                });
                res.end(e.message);
            }
            else {
                throw e;
            }
        }
    }
}
