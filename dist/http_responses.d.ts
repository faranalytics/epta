type HTTPResponseCode = 200 | 404 | 500;
export declare class HTTPResponse {
    code: HTTPResponseCode;
    message: string;
    constructor(code: HTTPResponseCode, message: string);
}
export declare class HTTP200Response extends HTTPResponse {
    body: string;
    contentType?: string;
    constructor(body: string, contentType?: string);
}
export declare class HTTP404Response extends HTTPResponse {
    constructor();
}
export declare class HTTP500Response extends HTTPResponse {
    constructor();
}
export {};
//# sourceMappingURL=http_responses.d.ts.map