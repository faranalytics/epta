type HTTPResponseCode = 200 | 404 | 500;

export class HTTPResponse {
    public code: HTTPResponseCode;
    public message: string;
    constructor(code: HTTPResponseCode, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class HTTP200Response extends HTTPResponse {
    public body: string;
    public contentType?: string;

    constructor(body:string, contentType?: string) {
        super(200, '200 OK');
        this.body = body;
        this.contentType = contentType;
    }
}

export class HTTP404Response extends HTTPResponse {
    constructor() {
        super(404, '404 Not Found');
    }
}

export class HTTP500Response extends HTTPResponse {
    constructor() {
        super(500, '500 Internal Server Error');
    }
}

