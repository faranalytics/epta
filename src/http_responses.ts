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
    constructor(message: string = '200 OK') {
        super(200, message);
    }
}

export class HTTP404Response extends HTTPResponse {
    constructor(message: string = '404 Not Found') {
        super(404, message);
    }
}

export class HTTP500Response extends HTTPResponse {
    constructor(message: string = '500 Internal Server Error') {
        super(500, message);
    }
}

