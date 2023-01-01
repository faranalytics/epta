export { requestListener, createRoute, logRequestTo, matchHost, matchMethod, matchPath, matchSchemePort, routeTo, Context } from './routes.js';
export { HTTP404Response, HTTP500Response, HTTPResponse } from './http_responses.js';
import { ReturnT } from './routes.js';
export declare function createRequestListener(router: ReturnT): (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>) => Promise<any>;
//# sourceMappingURL=index.d.ts.map