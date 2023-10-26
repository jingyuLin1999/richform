import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

const langFiles = require.context('./lang', true, /\.js$/)

const langs = langFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = langFiles(modulePath)
    modules[moduleName] = value.default;
    return modules
}, {})

const i18n = new VueI18n({
    warnHtmlMessage: false,
    locale: localStorage.getItem("lang") || "zh-CN",
    globalInjection: true,
    legacy: false,
    messages: langs
})

export default i18n