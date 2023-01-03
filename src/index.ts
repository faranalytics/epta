import { requestListener, ReturnT, RequestListenerOptions } from './routes.js';
export { HTTP200Response, HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export { logger } from 'wrighter';
export {
    requestListener,
    RequestListenerOptions,
    createRoute,
    matchHost,
    matchMethod,
    matchPath,
    matchSchemePort,
    routeTo,
    Context
} from './routes.js';

export function createRequestListener(router: ReturnT, options: RequestListenerOptions) {
    return requestListener(router, options)();
}