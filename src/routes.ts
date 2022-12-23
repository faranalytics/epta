import { create } from 'wrighter';

export let matchHost = create((req: any, res: any, ctx: any, match: string) => {

    if (match.match(req.host)) {
        return true;
    }
    else {
        return false;
    }
});


export let matchMethod = create((req: any, res: any, ctx: any, match: string) => {

    if (match.match(req.method)) {
        return true;
    }
    else {
        return false;
    }
});

export let resource = create((...args) => {
    console.log(args);
    return true;
});