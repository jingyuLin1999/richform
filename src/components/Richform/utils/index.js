import request from "./http"

export function isUrl(url) {
    let Exp = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
    return Exp.test(url);
}

export function loadDict(url, data) {
    return request({
        method: 'post',
        url,
        data,
    })
}