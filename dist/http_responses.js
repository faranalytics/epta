export class HTTPResponse {
    code;
    text;
    body;
    header;
    constructor(code, text) {
        this.code = code;
        this.text = text;
    }
}
export class HTTP200Response extends HTTPResponse {
    constructor(body, header) {
        super(200, 'OK');
        this.body = body;
        this.header = header;
    }
}
export class HTTP301Response extends HTTPResponse {
    constructor(header) {
        super(301, 'Moved Permanently');
        this.header = header;
    }
}
export class HTTP404Response extends HTTPResponse {
    constructor(body, header) {
        super(404, 'Not Found');
        this.body = body;
        this.header = header;
    }
}
export class HTTP500Response extends HTTPResponse {
    constructor(body, header) {
        super(500, 'Internal Server Error');
        this.body = body;
        this.header = header;
    }
}
