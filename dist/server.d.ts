/// <reference types="node" />
import { ListenOptions } from 'node:net';
export declare class HTTPServer {
    private router;
    constructor(options: ListenOptions, router: (...args: Array<any>) => Promise<boolean | null>);
    private request;
}
//# sourceMappingURL=server.d.ts.map