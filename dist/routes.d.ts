import { RouterT, HandlerT } from './types.js';
export declare let matchSchemePort: (scheme: "https" | "http", port: number) => (...routes: (RouterT | HandlerT | (RouterT | HandlerT)[])[]) => RouterT | HandlerT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: (RouterT | HandlerT | (RouterT | HandlerT)[])[]) => RouterT | HandlerT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: (RouterT | HandlerT | (RouterT | HandlerT)[])[]) => RouterT | HandlerT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: (RouterT | HandlerT | (RouterT | HandlerT)[])[]) => RouterT | HandlerT;
