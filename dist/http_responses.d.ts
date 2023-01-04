/// <reference types="node" />
import { OutgoingHttpHeaders } from "node:http";
type HTTPResponseCode = 200 | 301 | 404 | 500;
export declare abstract class HTTPResponse {
    code: HTTPResponseCode;
    text: string;
    body?: string;
    header?: OutgoingHttpHeaders;
    constructor(code: HTTPResponseCode, text: string);
}
export declare class HTTP200Response extends HTTPResponse {
    constructor(body?: string, header?: OutgoingHttpHeaders);
}
export declare class HTTP301Response extends HTTPResponse {
    constructor(header: {
        location: string;
    });
}
export declare class HTTP404Response extends HTTPResponse {
    constructor(body?: string, header?: {
        location: string;
    });
}
export declare class HTTP500Response extends HTTPResponse {
    constructor(body?: string, header?: {
        location: string;
    });
}
export {};
