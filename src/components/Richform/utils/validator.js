import Ajv from 'ajv'
import ajvI18n from 'ajv-i18n'

const ajv = new Ajv({
    useDefaults: true,//校验时会自动填入缺省值
    coerceTypes: true,//强制类型转换，如type="boolean"，而value="其他类型"，会被转换为boolean，
    allErrors: true
})
// require("ajv-errors")(ajv)
// ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-07.json'));

// 将语言名称统一处理
const langMap = {
    'zh-cn': 'zh',
    'en': 'en'
}

export const localize = function (errors) {
    let curLang = ('zh-cn' || 'en').toLowerCase()
    // 更名
    if (curLang in langMap) curLang = langMap[curLang]
    try {
        return ajvI18n[curLang](errors)
    } catch (e) {
        return ajvI18n.en(errors)
    }
}
ajv.localize = localize


export default ajv
