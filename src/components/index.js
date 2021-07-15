import Vue from 'vue'

import RichForm from "./Richform/index.vue"
Vue.component("RichForm", RichForm)

import FormDesign from "./Formdesign/index.vue"
Vue.component("FormDesign", FormDesign)

import SplitLayout from "./SplitLayout/index.vue"
Vue.component("SplitLayout", SplitLayout)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


export { RichForm, FormDesign, SplitLayout }