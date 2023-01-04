import http, { OutgoingHttpHeaders } from 'node:http';
import { accept } from 'wrighter';
import { HTTPResponse } from './http_responses.js';

export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export {
    createRoute,
    matchHost,
    redirectTo,
    matchMethod,
    matchPath,
    matchSchemePort,
    routeTo
} from './routes.js';

export interface RequestListenerEvents {
    request?: (req: http.IncomingMessage, res: http.ServerResponse) => void;
    response?: (req: http.IncomingMessage, res: http.ServerResponse, httpResponse?: HTTPResponse) => void;
    error?: (req: http.IncomingMessage, res: http.ServerResponse, error: Error) => void;
}

export interface RequestListenerOptions {
    events?: RequestListenerEvents;
    responseTimeout?: number;
}

export let createRequestListener = (
    router: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<any>,
    options: RequestListenerOptions
) => {

    return async (req: http.IncomingMessage, res: http.ServerResponse) => {

        let code: number = 500;
        let header: OutgoingHttpHeaders = {};
        let body: string = '';

        let result: any;

        try {
            if (typeof options?.events?.request == 'function') {
                options.events.request(req, res);
            }

            result = await router(req, res);

            if (result instanceof HTTPResponse) {
                code = result.code;
                body = result.body ? result.body : result.text;
                header = result.header ? result.header : {};
            }
            else {
                code = 404;
                body = 'Not Found';
                header = {};
            }
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                code = 500;
                header = {};
                body = 'Internal Server Error';

                if (typeof options?.events?.error == 'function') {
                    options.events.error(req, res, e);
                }
            }
        }
        finally {
            if (result == accept) {
                /*This happens when a handler handles a request on its own.  If the routing result is `accept` then the connection should be closed according to a timeout in the event that the handler doesn't handle the request within a specified amount of time.*/
            }
            else {
                header['content-length'] = Buffer.byteLength(body)
                res.writeHead(code, header);
                res.end(body);

                if (typeof options?.events?.response == 'function') {
                    options.events.response(req, res, result);
                }
            }
        }
    }
}
