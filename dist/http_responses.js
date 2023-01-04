export class HTTPResponse {
    code;
    text;
    header;
    body;
    constructor(body, header, code, text) {
        this.code = code;
        this.text = text;
        this.body = body;
        this.header = header;
    }
}
export class HTTP200Response extends HTTPResponse {
    constructor({ body = '', header = {} } = {}) {
        super(body, header, 200, 'OK');
    }
}
export class HTTP301Response extends HTTPResponse {
    constructor({ body = '', header = {} } = {}) {
        super(body, header, 301, 'Moved Permanently');
    }
}
export class HTTP404Response extends HTTPResponse {
    constructor({ body = '', header = {} } = {}) {
        super(body, header, 404, 'Not Found');
    }
}
export class HTTP500Response extends HTTPResponse {
    constructor({ body = '', header = {} } = {}) {
        super(body, header, 500, 'Internal Server Error');
    }
}
