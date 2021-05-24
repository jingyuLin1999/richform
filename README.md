# richform

## 主要功能
* richform表单组件
    * 数据驱动
    * 以JsonSchema格式为校验模板
    * 可拓展性，widgets下可自定义一些子组件
* 表单设计器 
    * 基于richform表单的拓展，可动态设计表单
    * 表单设计所见即所得
    * 最终获取RichForm的标准json数据
* 签核流程 
    * 基于RichForm和表单设计器的拓展
    * 流程配置。动态添加节点，设计各节点的签核顺序，串并联签核
    * 节点个性化。每个节点表单用RichForm显示，数据来源于表单设计器的设计结果
    * 节点属性。签核人设置、签核类型（会签，串签）、出口配置
    * 已签核状态显示
    * 错误处理

## 用法


## 项目运行
```
npm install
```

### 开发模式下编译和热重载
```
npm run serve
```

### 生产模式下打包
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
