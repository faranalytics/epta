import { createHandler, accept, deny } from 'wrighter';
export let routeTo = createHandler(function routeTo(fn) {
    return async (req, res) => {
        await fn(req, res);
        return accept;
    };
});
export let redirectTo = createHandler(function redirectTo(location) {
    return async (req, res) => {
        return accept;
    };
});
export let matchFileResource = createHandler(function matchFileResource(doc_root, fileNameRegex) {
    return async (req, res) => {
        // // fs.createReadStream('tmp/test.txt', {encoding: 'utf8'});
        // if (req.url) {
        //     let url = new URL(req.url, `scheme://${req.headers.host}/`);
        //     console.log(url);
        //     let path = pth.join(doc_root, url.pathname);
        // }
        return deny;
    };
});
