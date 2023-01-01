export {
    requestListener,
    createRoute,
    logRequestTo,
    matchHost,
    matchMethod,
    matchPath,
    matchSchemePort,
    routeTo,
    Context
} from './routes.js';
export { HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
export {logger} from 'memoir';

import { logger as log } from 'memoir';
import { requestListener, ReturnT } from './routes.js';


export function createRequestListener(router: ReturnT) {
    return requestListener(router, {accessLog:log.debug, errorLog:log.error})();
}