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

export function debounce(delay, callback) {
    let lastTime

    return function () {
        clearTimeout(lastTime)

        const [that, args] = [this, arguments]

        lastTime = setTimeout(() => {
            callback.apply(that, args)
        }, delay)
    }
}

export function observerDomResize(dom, callback) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    const observer = new MutationObserver(callback)

    observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true, subtree: true, })

    return observer
}

/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */
export function getRgbValueFromHex(color) {
    color = color.replace('#', '');
    if (color.length === 3) color = Array.from(color).map(function (hexNum) {
        return hexNum + hexNum;
    }).join('');
    color = color.split('');
    return new Array(3).fill(0).map(function (t, i) {
        return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
    });
}