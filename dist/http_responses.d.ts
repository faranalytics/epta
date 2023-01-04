/// <reference types="node" />
import { OutgoingHttpHeaders } from "node:http";
type HTTPResponseCode = 200 | 301 | 404 | 500;
interface HTTPResponseOptions {
    body?: string;
    header?: OutgoingHttpHeaders;
}
export declare abstract class HTTPResponse {
    code: HTTPResponseCode;
    text: string;
    header: OutgoingHttpHeaders;
    body: string;
    constructor(body: string, header: OutgoingHttpHeaders, code: HTTPResponseCode, text: string);
}
export declare class HTTP200Response extends HTTPResponse {
    constructor({ body, header }?: HTTPResponseOptions);
}
export declare class HTTP301Response extends HTTPResponse {
    constructor({ body, header }?: HTTPResponseOptions);
}
export declare class HTTP404Response extends HTTPResponse {
    constructor({ body, header }?: HTTPResponseOptions);
}
export declare class HTTP500Response extends HTTPResponse {
    constructor({ body, header }?: HTTPResponseOptions);
}
export {};
