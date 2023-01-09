import { RouterT } from './types.js';
export declare let matchSchemePort: (scheme: "http" | "https", port: number) => (...routes: (RouterT | RouterT[])[]) => RouterT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: (RouterT | RouterT[])[]) => RouterT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: (RouterT | RouterT[])[]) => RouterT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: (RouterT | RouterT[])[]) => RouterT;
