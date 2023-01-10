import { RouterT, HandlerT } from './types.js';
export declare let matchSchemePort: (scheme: "https" | "http", port: number) => (...routes: (HandlerT | RouterT | (HandlerT | RouterT)[])[]) => HandlerT | RouterT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: (HandlerT | RouterT | (HandlerT | RouterT)[])[]) => HandlerT | RouterT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: (HandlerT | RouterT | (HandlerT | RouterT)[])[]) => HandlerT | RouterT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: (HandlerT | RouterT | (HandlerT | RouterT)[])[]) => HandlerT | RouterT;
