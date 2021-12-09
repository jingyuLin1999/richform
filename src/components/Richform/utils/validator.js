const Ajv = require("ajv")
const ajvI18n = require("ajv-i18n")

// https://ajv.js.org/api.html
const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: false, // 校验时会自动填入缺省值
    coerceTypes: true, // 强制类型转换，如type="boolean"，而value="其他类型"，会被转换为boolean，
    allErrors: true, // 是否显示所有的错误，否则则显示单条数据
    strict: false, // 严格模式，若开启，则schema中不能自定义字段
})
require("ajv-errors")(ajv, { singleError: false }); // 自定义错误信息

// 将语言名称统一处理
const langMap = {
    'zh-cn': 'zh',
    'en': 'en'
}

export const localize = function (errors, lang = "zh-cn") {
    let curLang = lang.toLowerCase()
    if (curLang in langMap) curLang = langMap[curLang] // 更名
    try {
        return ajvI18n[curLang](errors)
    } catch (e) {
        return ajvI18n.en(errors)
    }
}
ajv.localize = localize


export default ajv