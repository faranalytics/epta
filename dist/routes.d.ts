import { RouteT } from './types.js';
export declare let matchSchemePort: (scheme: "http" | "https", port: number) => (...routes: (((...routeArgs: any[]) => Promise<any>) | ((...routeArgs: any[]) => Promise<any>)[])[]) => RouteT;
export declare let matchHost: (hostRegex: RegExp) => (...routes: (((...routeArgs: any[]) => Promise<any>) | ((...routeArgs: any[]) => Promise<any>)[])[]) => RouteT;
export declare let matchMethod: (methodRegex: RegExp) => (...routes: (((...routeArgs: any[]) => Promise<any>) | ((...routeArgs: any[]) => Promise<any>)[])[]) => RouteT;
export declare let matchPath: (pathRegex: RegExp) => (...routes: (((...routeArgs: any[]) => Promise<any>) | ((...routeArgs: any[]) => Promise<any>)[])[]) => RouteT;
