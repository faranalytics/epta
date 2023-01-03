import { requestListener } from './routes.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export { requestListener, createRoute, matchHost, redirectTo, matchMethod, matchPath, matchSchemePort, routeTo, Context } from './routes.js';
export function createRequestListener(router, options) {
    return requestListener(router, options)();
}
