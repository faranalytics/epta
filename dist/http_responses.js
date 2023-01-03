export class HTTPResponse {
    code;
    message;
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
export class HTTP200Response extends HTTPResponse {
    body;
    contentType;
    constructor(body, contentType) {
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
