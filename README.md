# richform

## 主要功能
* richform表单组件
    * 数据驱动
    * 校验规则采用标准的JsonSchema,[JsonSchema文档](https://github.com/jingyuLin1999/richform/blob/main/JSON-Schema.md)
    * 可拓展性，widgets下可自定义一些子组件
* 表单设计器 
    * 基于richform表单的拓展，可动态设计表单
    * 表单设计所见即所得
    * 可设置字段属性和校验规则
* 签核流程 
    * 基于RichForm和表单设计器的拓展
    * 流程配置。动态添加节点，设计各节点的签核顺序，串并联签核
    * 节点个性化。每个节点表单用RichForm显示，数据来源于表单设计器的设计结果
    * 节点属性。签核人设置、签核类型（会签，串签）、出口配置
    * 已签核状态显示
    * 错误处理

## 支持vue2.x  
vue3.x 请见[richform-plus](https://github.com/jingyuLin1999/richform-plus)

## 预览

### 在线预览

[表单设计器](http://117.73.12.76/demo/richform/#/ )  

[富表单完整功能](http://117.73.12.76/demo/richform/#/form-design )   

### 本地预览
```
npm install

npm run serve
```
[表单设计器](http://localhost:8080/#/ )  
http://localhost:8080/#/  
 
[富表单完整功能](http://localhost:8080/#/form-design )   
http://localhost:8080/#/form-design   

## 用法
```
npm i richform -S
```

```html
<div class="demo-wrapper">
    <div class="form-design">
        <form-design />
    </div>
    <div class="rich-form">
        <rich-form :form="form" :schema="schema" :values="values"/>
    </div>
</div>
```

```js
import { RichForm, FormDesign } from "richform";
export default {
  components: { RichForm,FormDesign},
  data() {
    return {
        schema: {}, // 验证规则
        values: {}, // 表单的值
        form: {
            border: true, // 显示边框
            grid: false, // 表单内部栅栏
            labelSuffix: ":", // 字段标题后缀内容，默认' : '
            labelWidth: "110px", // 标签宽度,默认50px
            validator: "input", // submit
            labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
            labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
            actions: [
                //声明显示在下方和动作按钮
                {
                    name: "reset", // 按键的唯一标识符
                    type: "primary", // 按键类型,默认为primary，具体可见element button
                    title: "重置", // 按键的文字
                    icon: "el-icon-star-off", // 按键图标 具体可见element icon
                    right: true, // 如果=true，则显示在右侧
                    visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                    tips: "提示信息", // 鼠标悬浮在按键的提示信息
                    top: true, // 是否在上面, false则在下面
                    size: "medium" // medium / small / mini, 若未指明，则等同于form.size
                },
                {
                    name: "submit", // 按键的唯一标识符
                    type: "info", // 按键类型,默认为primary，具体可见element button
                    title: "提交", // 按键的文字
                    icon: "", // 按键图标 具体可见element icon
                    right: true, // 如果=true，则显示在右侧
                    visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                    tips: "提示信息", // 鼠标悬浮在按键的提示信息
                    top: true, // 是否在上面, false则在下面
                    size: "medium" // medium / small / mini, 若未指明，则等同于form.size
                }
            ],
            layout: [
                {
                    title: "名称对方",
                    widget: "input",
                    name: "input", // values的箭值，必须有
                    type: "text",
                },
                // 更多子组件请见widgets介绍，或者看完整功能
            ]
        }
    }
  }
}
```

## 特殊功能  
1、字段选项依赖  
```js
{
  title: "下拉选框B",
  widget: "select",
  name: "selectB",
  description: "我的选项依赖于【下拉选框A】",
  dict: {
    "selectA==选项1": [
      {
        value: "选项1",
        label: "根据[下拉选框A]的值变化A",
      },
      {
        value: "选项2",
        label: "根据[下拉选框A]的值变化B",
      },
    ],
    "selectA == 选项2": "http://localhost:8080/#/form-design",
    "input == 123456": [
      {
        value: "input等于123456",
        label: "input等于123456",
      },
    ],
  },
  options: [
    {
      value: "选项1",
      label: "黄金糕",
    },
    {
      value: "选项2",
      label: "双皮奶",
    },
  ],
}
```
补充说明  
当两个select的选项互相依赖时，箭值为条件，值可以有三种形式，若是url则获取数据，若是数组则直接赋值给options  
```js
dict: "http://localhost:8080/#/form-design", // 获取到的值会直接覆盖options
dict: {  
  [<字段名name> == 'A']: "https://shandawang.com/dict/province", // 字典，
  [<字段名name> == 'B']: [{},{}], // options
  [<字段名name> == 'any']: "https://shandawang.com/dict/province", // 若等于any且值是url，<字段名name>的值只要变化，就会带上<字段名name>值到后端过滤获取字典
  [<字段名name> == 'any']: {filterKey: "id"}, // 若等于any且值是对象，filterKey字段和options都必须有。<字段名name>的值只要变化，就会带上<字段名name>值到options中过滤。有一种特殊应用，当被依赖的字段值变化了，根据被依赖选项({label,value,other})的某个字段的值到当前options过滤，此时可配beRelyFilterKey如 {filterKey: "id",beRelyFilterKey: "other"}
}
```
2、字段隐藏依赖 
```js
{
    title: "名称对方",
    widget: "input",
    name: "input",
    type: "textarea",
    hideRely: "radioA==单选框B",
}
```
补充说明
```js
hideRely：<字段名称nameA> == 'C', // 可以是单值  
hideRely：[ // 也可以是多值，只要满足一个条件，就隐藏,且后面条件不会再校验   
  <字段名称nameA> == 'C',  
  <字段名称nameB> == 'D',
]
```
3、更多widgets配置详情  
请见src/pages/richform.vue

## 深度编辑  
values可能是深度嵌套如下  
```js
{
  title: {
    text: "ECharts 入门示例",
    subtext: "Living Expenses in Shenzhen",
  },
  legend: {
    orient: "horizontal", // vertical/horizontal
    left: 0,
    // top: 0,
    bottom: 0,
  },
}
```
要编辑这种valuse可开启deepValues: true  
```html
  <rich-form :form="form" :schema="schema" :values="values" deepValues/>
```
此时在定义form的name字段和shema结构，需要与values的结构对应    
```js
layout: [{
  title: "标题",
  widget: "input",
  name: "title.text",
}]
```
[例子](http://117.73.12.76/demo/richform/#/deep-values )  
