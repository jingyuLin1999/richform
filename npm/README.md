# Richform  

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

## 预览  

[表单设计器](https://www.shandawang.com/richform/#/)  

[完整功能](https://www.shandawang.com/richform/#/form-design)  

## 用法
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
  data() {
    return {
        schema: {}, // 验证规则
        values: {}, // 表单的值
        form: {
            border: true, // 显示边框
            grid: false, // 表单内部栅栏
            labelSuffix: true, // 字段标题后缀内容，默认' : '
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
            }],
        },
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
```

## 特殊功能  
1、依赖配置  
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
2、隐藏配置  
```js
{
    title: "名称对方",
    widget: "input",
    name: "input",
    type: "textarea",
    hideRely: "radioA==单选框B",
}
```

## 更多widgets配置详情  
[请见源码](https://github.com/jingyuLin1999/richform.git)，目录src/pages/richform.vue的完整数据。 

<br/>






