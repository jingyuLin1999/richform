import request from "./http"

export function isUrl(url) {
    let Exp = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
    return Exp.test(url);
}

export function loadDict(url, data, method) {
    return request({
        url,
        method: method,
        [method == "post" ? "data" : "params"]: data
    })
}

// 将字符串转成对象,若转失败则直接返回源字符串
export function strToObj(str) {
    try {
        return /^{.*}$/.test(str) || /^\[.*\]$/.test(str) ? JSON.parse(str) : str;
    } catch {
        return str
    }
}

export function deleteIteration(obj = {}, keys = []) {
    if (keys.length == 1) {
        delete obj[keys[0]];
        return;
    }
    obj = obj[keys[0]];
    keys.shift();
    return deleteIteration(obj, keys);
}