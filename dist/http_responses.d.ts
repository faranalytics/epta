type HTTPResponseCode = 200 | 404 | 500;
export declare class HTTPResponse {
    code: HTTPResponseCode;
    message: string;
    constructor(code: HTTPResponseCode, message: string);
}
export declare class HTTP200Response extends HTTPResponse {
    constructor(message?: string);
}
export declare class HTTP404Response extends HTTPResponse {
    constructor(message?: string);
}
export declare class HTTP500Response extends HTTPResponse {
    constructor(message?: string);
}
export {};
//# sourceMappingURL=http_responses.d.ts.map