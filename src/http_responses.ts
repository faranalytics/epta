import { OutgoingHttpHeaders } from "node:http";

type HTTPResponseCode = 200 | 301 | 404 | 500;

interface HTTPResponseOptions {
    body?: string,
    header?: OutgoingHttpHeaders;
}

export abstract class HTTPResponse {
    public code: HTTPResponseCode;
    public text: string;
    public header: OutgoingHttpHeaders;
    public body: string;
    constructor(body: string, header: OutgoingHttpHeaders, code: HTTPResponseCode, text: string) {
        this.code = code;
        this.text = text;
        this.body = body;
        this.header = header;
    }
}

export class HTTP200Response extends HTTPResponse {
    constructor({ body = '', header = {} }: HTTPResponseOptions = {}) {
        super(body, header, 200, 'OK');
    }
}

export class HTTP301Response extends HTTPResponse {
    constructor({ body = '', header = {} }: HTTPResponseOptions = {}) {
        super(body, header, 301, 'Moved Permanently');
    }
}

export class HTTP404Response extends HTTPResponse {
    constructor({ body = '', header = {} }: HTTPResponseOptions = {}) {
        super(body, header, 404, 'Not Found');
    }
}

export class HTTP500Response extends HTTPResponse {
    constructor({ body = '', header = {} }: HTTPResponseOptions = {}) {
        super(body, header, 500, 'Internal Server Error');
    }
}

