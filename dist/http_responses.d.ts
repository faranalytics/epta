export declare class HTTPResponse extends Error {
    code: number;
    constructor(message?: string, cause?: Error);
}
export declare class HTTP404Response extends HTTPResponse {
    constructor(message?: string, cause?: Error);
}
export declare class HTTP500Response extends HTTPResponse {
    constructor(message?: string, cause?: Error);
}
//# sourceMappingURL=http_responses.d.ts.map