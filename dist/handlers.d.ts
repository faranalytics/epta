import * as http from 'node:http';
export declare let routeTo: (fn: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>) => (...routeArgs: any[]) => Promise<any>;
export declare let redirectTo: (location: string) => (...routeArgs: any[]) => Promise<any>;
export declare let matchFileResource: (docRoot: string, fileNameRegex: RegExp) => (...routeArgs: any[]) => Promise<any>;
