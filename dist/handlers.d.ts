import { RouterT, HandlerT } from './types.js';
export declare let matchPathToHTTPRedirect: (pathRegex: RegExp, location: string, code: 301 | 302 | 307 | 308) => RouterT;
export declare let matchAllToDefaultHTTPResponse: (code: number, body?: string | undefined) => RouterT;
export declare let matchAllToHTTPResponse: (code: number, body?: string | undefined) => RouterT;
export declare let matchExtensionToMediaType: (mediaTypeExtension: {
    [mediaType: string]: RegExp;
}, docRoot: string) => RouterT;
export declare let matchPathToDefaultExportHandler: (pathRegex: RegExp, module: Promise<{
    default: HandlerT;
}>) => RouterT;
