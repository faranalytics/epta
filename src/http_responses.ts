type HTTPResponseCode = 200 | 301 | 404 | 500;

export interface Header { 
    [name: string]: string | number | readonly string[] 
};

export abstract class HTTPResponse {
    public code: HTTPResponseCode;
    public text: string;
    public body?: string;
    public header?: Header;
    constructor(code: HTTPResponseCode, text: string) {
        this.code = code;
        this.text=text;
    }
}

export class HTTP200Response extends HTTPResponse {
    constructor(body?: string, header?: Header) {
        super(200, 'OK');
        this.body = body;
        this.header = header;
    }
}


export class HTTP301Response extends HTTPResponse {
    public header: Header;
    constructor(header: {location: string}) {
        super(301, 'Moved Permanently');
        this.header = header;
    }
}


export class HTTP404Response extends HTTPResponse {
    constructor(body?: string, header?: {location: string}) {
        super(404, 'Not Found');
        this.body = body;
        this.header = header;
    }
}

export class HTTP500Response extends HTTPResponse {
    constructor(body?: string, header?: {location: string}) {
        super(500, 'Internal Server Error');
        this.body = body;
        this.header = header;
    }
}

