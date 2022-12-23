import * as http from 'node:http';
import * as util from 'node:util';
import { ListenOptions } from 'node:net';
import { HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';

export class HTTPServer {

    private router: (...args: Array<any>) => Promise<boolean | null>;

    constructor(options: ListenOptions, router: (...args: Array<any>) => Promise<boolean | null>) {
        this.router = router;
        let server = new http.Server().listen(options);
        server.addListener('request', this.request.bind(this));
    }

    private async request(req: http.IncomingMessage, res: http.ServerResponse) {
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
