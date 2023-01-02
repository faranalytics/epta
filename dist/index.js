import { logger as log } from 'wrighter';
import { requestListener } from './routes.js';
export function createRequestListener(router, options = { accessLog: log.debug, errorLog: log.error }) {
    return requestListener(router, options)();
}
export { HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { requestListener, createRoute, matchHost, matchMethod, matchPath, matchSchemePort, routeTo, Context } from './routes.js';
