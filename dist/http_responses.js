export class HTTPResponse {
    code;
    message;
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}
export class HTTP200Response extends HTTPResponse {
    constructor(message = '200 OK') {
        super(200, message);
    }
}
export class HTTP404Response extends HTTPResponse {
    constructor(message = '404 Not Found') {
        super(404, message);
    }
}
export class HTTP500Response extends HTTPResponse {
    constructor(message = '500 Internal Server Error') {
        super(500, message);
    }
}
