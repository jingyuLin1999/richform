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

## 属性  

名称           | 类型   |默认值|说明 
---            | ---   | ---  |---
schema         |object | {}   |schema
form           |object | {}   |form
values         |object | {}   |过滤条件对应的默认值

<br/>






