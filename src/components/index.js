import Vue from 'vue'

import RichForm from "./Richform/index.vue"
Vue.component("RichForm", RichForm)

import FormDesign, { FormMetas } from "./Formdesign/index.vue"
Vue.component("FormDesign", FormDesign)

import SplitLayout from "./SplitLayout/index.vue"
Vue.component("SplitLayout", SplitLayout)

export { RichForm, FormDesign, FormMetas, SplitLayout }