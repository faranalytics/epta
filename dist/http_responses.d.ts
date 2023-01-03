type HTTPResponseCode = 200 | 301 | 404 | 500;
export interface Header {
    [name: string]: string | number | readonly string[];
}
export declare abstract class HTTPResponse {
    code: HTTPResponseCode;
    text: string;
    body?: string;
    header?: Header;
    constructor(code: HTTPResponseCode, text: string);
}
export declare class HTTP200Response extends HTTPResponse {
    constructor(body?: string, header?: Header);
}
export declare class HTTP301Response extends HTTPResponse {
    header: Header;
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
//# sourceMappingURL=http_responses.d.ts.map