# 简介
要真正理解 JSON Schema，首先需要知道什么是 JSON。

JSON 代表 “JavaScript对象表示法”，是一种简单的数据交换格式。它最初是万维网的一个符号。因为JavaScript存在于大多数Web浏览器中，而JSON是基于JavaScript的，所以JavaScript自然是支持JSON的。现在，JSON已经被证明是非常简单和有用的，因此已经被用于许多不涉及Web的环境中。

JSON的核心是建立在以下数据结构之上的：

英文文档：https://json-schema.org/understanding-json-schema/

## 数据类型

- **object：**

```json
{ "key1": "value1", "key2": "value2" }
```

- **array：**

```json
[ "first", "second", "third" ]
```

- **number**：

```json
42
3.1415926
1
2
```

- **string：**

```json
"This is a string"
```

- **boolean：**

```
true
false
```

- **null：**

```json
null
```



这些类型在大多数编程语言中都有相似之处，尽管它们可能有不同的名称。

JavaScript类型的名称与它们在Python中的类似类型的对应关系如下表所示：

| JavaScript | Python    |
| ---------- | --------- |
| string     | string    |
| number     | int/float |
| object     | dict      |
| array      | list      |
| boolean    | bool      |
| null       | None      |


使用这些简单的数据类型，可以表示各种结构化数据。JSON的灵活性使得同一概念可以用无数种方式来表示。例如，可以用JSON以不同的方式表示一个人的信息：

```json
{
  "name": "George Washington",
  "birthday": "February 22, 1732",
  "address": "Mount Vernon, Virginia, United States"
}
{
  "first_name": "George",
  "last_name": "Washington",
  "birthday": "1732-02-22",
  "address": {
    "street_address": "3200 Mount Vernon Memorial Highway",
    "city": "Mount Vernon",
    "state": "Virginia",
    "country": "United States"
  }
}
```

尽管其中一种表述明显比另一种更正式，但是这两种表述都同样有效。记录的设计在很大程度上取决于它在应用程序中的预期用途，因此这里没有正确或错误的答案。然而，当应用程序说 “给我一个JSON记录”时，准确地知道该记录应该如何组织是很重要的。例如，我们需要知道需要哪些字段，以及值是如何表示的。这就是 `JSON Schema`的用武之地。下面的 `JSON Schema `片段描述了上面第二个示例的结构。现在不要太担心细节问题。它们将在后面的章节中进行解释。

 ```json
{
  "type": "object",
  "properties": {
    "first_name": { "type": "string" },
    "last_name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "country": { "type" : "string" }
      }
    }
  }
}
 ```

如果用这个 schema 验证第一个示例，将会失败，但是第二个会成功。

您可能已经注意到` JSON schema `本身是用JSON编写的。它本身就是数据，而不是计算机程序。它只是 “描述其他数据结构” 的格式声明。这就是它的优点和缺点（与其他类似的模式语言相同）。很容易简洁地描述数据的表面结构，并根据它自动验证数据。然而，由于`JSON schema` 不能包含任意代码，数据元素之间的关系上存在某些不能表达的约束。因此，对于足够复杂的数据格式，任何 “验证工具” 都可能有两个验证阶段：一个在 schema (或结构)级别，一个在语义级别。后一种检查可能需要使用更通用的编程语言来实现。

# JSON Schema 详解
下面的内容都是基于JSON Schema 草案 7，JSON Schema 的早期版本与这里描述的格式并不完全兼容。

为了方便起见，再不引起歧义的情况下，后面一律用JSON模式或者模式来指代 JSON Schema。

# 名词解释
为了方便后面的描述，我们将引用JSON模式规范中定义的一些名词，他们分别是：

## 实例

表示应用于JSON模式的JSON文档。

##  模式关键字

一个JSON模式必须是一个对象或者布尔值，而应用于实例的对象属性则称为关键字或模式关键字。

##  验证关键字

JSON模式可用于要求给定的实例满足一定数量的条件，而用于断言这些条件的关键字则被称为验证关键字。

#   验证关键字
验证关键字根据其适用范围分为如下几类：

- 适用于任何实例类型的验证关键字

- 数值实例的验证关键字

- 字符串实例的验证关键字

- 数组实例的验证关键字

- 对象实例的验证关键字

- 有条件的使用子模式的关键字

- 根据布尔逻辑使用子模式的关键字

- 用于验证格式语意的关键字

  

  下面就来一一进行介绍

# 适用于任何实例类型的关键字

## type

这个关键字的值必须是`字符串`或`数组`。如果它是一个数组，那么数组的元素必须是字符串，并且必须是惟一的。

字符串值必须是六种基本类型（`null`、`boolean`、`object`、`array`、`number` 或`string`）中的一种，或者是匹配任何小数部分为零的数字的` integer`。

当且仅当实例位于为该关键字列出的任何集合中时，实例才验证成功。

**例如**，如果要验证一个字符串类类型的实例，可以使用如下的JSON模式：

```json
{ "type": "string" }
```

**例如**，如果要验证一个字符串类型或者数值类型或者数组类型的实例，可以使用如下JSON模式：

```json
{ "type": ["string", "number", "array"] }
```

## enum

这个关键字的值必须是一个数组。这个数组应该至少有一个元素。数组中的元素应该是惟一的。

如果实例的值等于该关键字数组值中的某一个元素，则实例验证成功。

数组中的元素可以是任何值，包括 null。

例如，要验证一个实例的值是否在 “China”，“UK”，“US” 这三个值之中，可以使用如下的JSON模式：

```json
{ "enum": ["China", "UK", "US"] }
```

## const

这个关键字的值可以是任何类型，包括 null。

如果一个实例的值等于这个关键字的值，则验证成功。

例如，要验证一个实例的值是否是 “Foo”，可以使用如下的JSON模式：

```json
{ "const": "Foo" }
```

# 数值实例（number 和 integer）的验证关键字

## multipleOf

这个关键字的值必须是一个严格大于0的数字。

只有当数值实例除以这个关键字的值等于一个整数时才能验证通过。

## maximum

这个关键字的值必须是一个数字，表示一个数值实例的闭合上限。只有当实例小于等于这个关键字的值时才能验证通过。

## exclusiveMaximum

这个关键字的值必须是一个数字，表示一个数值实例的不闭合上限。只有当实例小于这个关键字的值时才能验证通过。

## minimum

这个关键字的值必须是一个数字，表示一个数值实例的闭合下限。只有当实例大于等于这个关键字的值时才能验证通过。

## exclusiveMinimum

这个关键字的值必须是一个数字，表示一个数值实例的不闭合下限。只有当实例大于这个关键字的值时才能验证通过。

例如，要验证一个大于等于5，小于等于10并且是1.5的倍数的数值类型的实例，可以使用如下JSON模式：

```json
{
  "type": "number",
  "multipleOf": 1.5,
  "minimum": 5,
  "maximum": 10
}
```

例如，要验证一个大于5，且小于9，并且是1.5的倍数的数值类型的实例，可以使用如下JSON模式：

```json
{
  "type": "number",
  "multipleOf": 1.5,
  "exclusiveMinimum": 5,
  "exclusiveMaximum": 9
}
```

# 字符串实例的验证关键字

## maxLength

这个关键字的值必须是一个非负整数。

只有当字符串实例的长度小于等于这个关键字的值时才能验证通过。

字符串实例的长度定义为 RFC7159 定义的字符串中包含的字符数。

## minLength

这个关键字的值必须是一个非负整数。

只有当字符串实例的长度大于等于这个关键字的值时才能验证通过。

字符串实例的长度定义为 RFC7159 定义的字符串中包含的字符数。

如果这个关键字的值为0，则相当于忽略这个关键字。

## pattern

这个关键字的值必须是字符串。根据ECMA 262正则表达式方言，这个字符串应该是一个有效的正则表达式。

如果正则表达式成功匹配实例，则认为字符串实例是有效的。回想一下：正则表达式不是隐式锚定的。

例如，要验证一个长度大于等于3且小于等于10，且匹配正则表达式 \d+_\d+_\d+ 的字符串实例，可以使用如下的JSON模式：

```json
schema = {
    "type": "string",
    "minLength": 3,
    "maxLength": 10,
    "pattern": "\\d+_\\d+_\\d+"
}
```

# 数组的验证关键字

## items

该关键字的值必须是一个有效的JSON模式或一个有效的JSON模式数组。

此关键字用来验证数组实例中的每个值，而不是直接验证实例本身。

如果这个关键字的值是一个模式，只有数组中的所有元素都对该模式成功验证，才算验证成功。

如果这个关键字是模式数组，那么如果实例的每个元素在相同的位置（如果有的话）对模式成功验证，才算验证成功。

省略此关键字与空模式具有相同的行为。

例如，要验证数组实例的每个元素是否都是长度大于等于3且小于等于5的字符串实例，可以使用如下的JSON模式：

```json
{
  "type": "array",
  items: {
    "type": "string",
    "minLength": 3,
    "maxLength": 5
  }
}
```

例如，要验证数组实例的每个元素是否依次为字符串，数值和布尔类型的实例，可以使用如下的JSON模式：

```json
{
    "type": "array",
    "items": [
        {"type": "string"},
        {"type": "number"},
        {"type": "boolean"}
    ]
}
```

## additionalItems

此关键字的值必须是一个有效的JSON模式或者一个布尔值。

此关键字用来验证数组中的元素，而不是直接验证直接实例本身。

如果 items 关键字的值是JSON模式数组，并且每个位于大于 items 大小位置的实例元素都成功通过此关键字指定的JSON模式的验证，则该关键字验证通过。

否则，该关键字必须被忽略，因为 items 关键字指定的JSON模式（可能是表示空模式的默认值）应用于所有元素。

省略此关键字与空模式具有相同的行为。

例如，当指定了 items 关键字的值为一个JSON模式数组时，要验证数组实例是否包含除过 items 关键字指定的JSON模式数组匹配到的其他元素时，可以使用如下的JSON模式：

```json
{
    "type": "array",
    "items": [
        {"type": "string"},
        {"type": "number"},
        {"type": "boolean"}
    ],
    "additionalItems": false
}
```


例如，当指定了 `items `关键字的值为一个JSON模式数组时，要验证数组实例中除过`items`关键字指定的JSON模式数组匹配到的元素之外的元素是对象类型，可以使用如下的JSON模式：

```json
{
    "type": "array",
    "items": [
        {"type": "string"},
        {"type": "number"},
        {"type": "boolean"}
    ],
    "additionalItems": {"type": "object"}
}
```

## maxItems

此关键字的值必须是一个非负整数。

如果一个数组实例的大小小于等于此关键字的值，则验证通过。

## minItems

此关键字的值必须是一个非负整数。

如果一个数组实例的大小大于等于此关键字的值，则验证通过。

## uniqueItems

此关键字的值必须是一个布尔值。

如果此关键字的值为布尔值 `false`，则数组实例验证通过。

如果此关键字的值为布尔值 `true`，并且数组实例中的每一个值都是唯一的，则验证通过。

## contains

此关键字的值必须是一个有效的JSON模式。

如果一个数组实例中至少有一个元素能通过此关键字指定的JSON模式的验证，则验证通过。

例如，如果要验证一个数组实例的大小大于等于3且小于等5，并且数组中的每个元素都是唯一的，并且至少有一个元素是数字0，则可以使用如下的JSON模式：

```json
{
    "type": "array",
    "minItems": 3,
    "maxItems": 5,
    "uniqueItems": True,
    "contains": {
        "type": "number",
        "const": 0
    }
}
```

# 对象的验证关键字

## maxProperties

此关键字的值必须是一个非负整数。

如果一个对象的属性个数小于等于此关键字的值，则验证通过。

例如，要验证对象实例的属性个数是否小于等5个，可以使用如下的JSON模式：

```json
{
  "type": "object",
  "maxProperties": 5
}
```

## minProperties

此关键字的值必须是一个非负整数。

如果一个对象的属性个数大于等于此关键字的值，则验证通过。

例如，要验证对象实例的属性个数是否大于等3个，可以使用如下的JSON模式：

```json
{
  "type": "object",
  "minProperties": 3
}
```

## required

此关键字的值必须是一个数组。数组中的每一个元素（如果有的话）必须是一个字符串，并且必须是唯一的。

如果此关键字的值中的每一个元素都是对象实例中某个属性的名称，则验证通过。

如果此关键字的值是一个空数组，则相当于省略这个关键字。

例如，要验证一个对象实例中是否包含名称为 name 和 age 的属性，可以使用如下JSON模式：

```json
{
  "type": "object",
  "required": ["name", "age"]
}
```

## properties

此关键字的值必须是一个对象。这个对象中的每一个值都必须是一个有效的JSON模式。

此关键字用来验证对象实例中的子实例，而不是验证这个对象实例本身。

验证成功的条件是，对于同时出现在实例和作为该关键字的值中的名称的每个名称，该名称的子实例成功通过对应模式的验证。

如果此关键字的值是一个空的对象，则其行为相当于省略该关键字。

例如，要验证如果一个对象实例中包含 name 和 age 属性，它们的值应该分别是字符串类型和数值类型，可以使用如下的JSON模式：

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  }
}
```

## patternProperties

该关键字的值必须是一个对象。该对象的每个属性名都应该是一个有效的正则表达式。该对象的每个属性值必须是一个有效的JSON模式。

这个关键字用来验证对象实例中的子实例，而不是验证这个对象实例本身。使用此关键字验证基本类型实例的结果总是成功。

对于实例中的每个元素` ki: vi `和该关键字中的每个元素` kj: vj`，如果所有 vi 都能被所有能匹配到vi 对应的 ki 的 kj 对应的 vj 验证通过，则该实例验证通过。

如果此关键字的值是一个空的对象，则其行为相当于省略该关键字。

例如，如果要验证对象实例中所有属性名以下划线开头的属性的属性值的长度是否都大于等于3并且所有属性名以下划线结束的属性的属性值是否都是10的整数倍，则可以使用如下的JSON模式：

```json
{
    "type": "object",
    "properties": {
        "_name": {
            "type": "string"
        },
        "age_": {
            "type": "number"
        },
        "salary_": {
            "type": "number"
        },
        "_department": {
            "type": "string"
        }
    },
    "patternProperties": {
        "^_": {
            "minLength": 3
        },
        "_$": {
            "multipleOf": 10
        }
    }
}
```



## additionalProperties

此关键字的值必须是一个有效的JSON模式或者一个布尔值。

此关键字用来验证对象实例中的子实例，而不是验证这个对象实例本身。

此关键字只验证实例中名称即不匹配 properties 中的任何名也不匹配 patternProperties 中任何正则表达式的元素的值。

如果此关键字的值是一个空的对象，则其行为相当于省略该关键字。

例如，要验证对象实例中的属性值是否在满足 properties 关键字和 patternProperties 中指定的JSON模式之外还满足类型为字符串或数值，并且值在 “SQA”，“R&D"和"IMP” 中，可以使用如下JSON模式：

```json
{
    "type": "object",
    "properties": {
        "_name": {
            "type": "string"
        },
        "age_": {
            "type": "number"
        },
        "salary": {
            "type": "number"
        }
    },
    "required": [
        "_name",
        "age_"
    ],
    "patternProperties": {
        "^_": {
            "minLength": 3
        },
        "_$": {
            "multipleOf": 10
        }
    },
    "additionalProperties": {
        "type": ["string", "number"],
        "enum": ['SQA', "R&D", "IMP"]
    }
}
```

## dependencies

此关键字用来指定一个规则，这个规则将用于判断包含某个属性的对象。

此关键字的值必须是一个对象。每个属性指定一个依赖项。每个依赖项值必须是一个数组或一个有效的JSON模式。

如果依赖项值是子模式，而依赖项键是实例中的属性，则整个实例必须根据依赖项值进行验证。

如果依赖项值是数组，则数组中的每个元素(如果有的话)必须是字符串，并且必须是惟一的。如果依赖项键是实例中的属性，则依赖项值中的每个项都必须是实例中存在的属性。

如果此关键字的值是一个空的对象，则其行为相当于省略该关键字。

例如，当依赖项值是有效的JSON模式，并且依赖项键是实例中的属性时，

例如，我们要用如下的一个JSON模式表示一个信用卡用户，当用户有信用卡卡号时，必须同时存在账单地址：

```json
{
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" },
    "billing_address": { "type": "string" }
  },

  "required": ["name"],

  "dependencies": {
    "credit_card": ["billing_address"]
  }
}
```


我们也可以使用另外一个JSON模式表示这个依赖关系：

```json
{
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" }
  },

  "required": ["name"],

  "dependencies": {
    "credit_card": {
      "properties": {
        "billing_address": { "type": "string" }
      },
      "required": ["billing_address"]
    }
  }
}
```


如果要表示信用卡卡号和账单地址的双向依赖关系，可以用如下的JSON模式表示：

```json
{
  "type": "object",

  "properties": {
    "name": { "type": "string" },
    "credit_card": { "type": "number" },
    "billing_address": { "type": "string" }
  },

  "required": ["name"],

  "dependencies": {
    "credit_card": ["billing_address"],
    "billing_address": ["credit_card"]
  }
}
```

或者下面的JSON模式：



    {
        "type": "object","properties": {
        "name": {"type": "string"},
        "credit_card": {"type": "number"},
        "billing_address": {"type": "string"}
    },
    "required": ["name"],
    "dependencies": {
        "credit_card": {
            "properties": {
                "billing_address": {
                    "type": "string"
                }
            },
            "required": ['billing_address']
        },
        "billing_address": {
            "properties": {
                "credit_card": {
                    "type": "number"
                }
            },
            "required": ["credit_card"]
        }
    }
}

## propertyNames

此关键字的值必须是一个有效的JSON模式。

如果实例中的每个属性的名称都成功通过作为该关键字的值的JSON模式的验证，则此关键字验证通过。

**注意：**

模式测试的属性名始终是字符串。相当于此关键字指定的JSON模式始终默认包含 {“type”: “string”}。

例如，要验证对象中的属性的属性名是否长度都大于等于3并且小于等于9，则可以使用如下的JSON模式：

```json
{
  "type": "object",
  "propertyNames": {
    "minLenght": 3,
    "maxLength": 9
  }
}
```

# 子模式的条件应用关键字

这些关键字协同工作，根据另一个子模式的结果实现子模式的条件应用。

这些关键字不能跨子模式边界相互交互。换句话说，allOf 中的一个分支中的 if 不能对另一个分支中的 then 或 else 产生影响。

当这些关键字不存在时，它们都没有默认行为。特别是，不能将它们视为带有空模式，当 if 不存在时，必须完全忽略 then 和 else。

## if

这个关键字的值必须是一个有效的JSON模式。

这个关键字指定的JSON模式的的验证结果对整个验证结果没有直接影响，而是用来控制 then 或 else 中的哪个关键字中的JSON模式被用来进行判断。

如果一个实例成功通过此关键字指定的JSON模式的验证，则该实例对 then 关键字指定的JSON模式也必须是有效的（如果 then 关键字存在）。

如果一个实例无法通过该关键字指定的JSON模式的验证，则该实例也必须对 else 关键字指定的JSON模式有效（如果 then 关键字存在）。

如果正在收集注释，则以通常的方式从该关键字的子模式中收集注释，包括在此关键字不包含 then 或 else 的情况下。

## then

这个关键字的值必须是一个有效的JSON模式。

如果存在 if 关键字，并且实例成功通过了 if 关键字指定的JSON模式的验证，那么如果实例也成功通过了这个关键字指定的JSON模式的验证，那么则该关键字验证通过。

如果没有 if 关键字，或者实例无法对其指定的JSON模式进行验证，则此关键字没有任何作用。在这种情况下，出于验证或注释收集的目的，实现不能根据这个关键字判断实例。

## else

这个关键字的值必须是一个有效的JSON模式。

如果存在 if 关键字，而实例未能对其指定的JSON模式进行验证，那么如果实例成功通过了该关键字指定的JSON模式的验证，那么则该关键字验证通过。

当 if 关键字不存在时，或者当实例成功验证其指定的JSON模式时，此关键字没有作用。在这种情况下，出于验证或注释收集的目的，实现不能根据这个关键字判断实例。

例如，如果我们用如下的JSON模式来处理美国和加拿大的地址。这些国家的邮政编码的格式不一样，我们想要根据地址所处的国家来验证邮政编码的格式。如果是美国的地址，则邮政编码字段由5位数字和可选的4位数字后缀组成，如果是加拿大的地址，则邮政编码是固定的6位长度的数字和大写字母组合。

```json
{
  "type": "object",
  "properties": {
    "street_address": {
      "type": "string"
    },
    "country": {
      "enum": ["United States of America", "Canada"]
    }
  },
  "if": {
    "properties": { "country": { "const": "United States of America" } }
  },
  "then": {
    "properties": { "postal_code": { "pattern": "[0-9]{5}(-[0-9]{4})?" } }
  },
  "else": {
    "properties": { "postal_code": { "pattern": "[A-Z0-9]{6}" } }
  }
}
```

上面的例子只能处理两个国家的地址，如果要处理多个国家的地址，可以使用 allOf 关键字将 if-then 关键字组合起来使用，入下所示：

```json
{
  "type": "object",
  "properties": {
    "street_address": {
      "type": "string"
    },
    "country": {
      "enum": ["US", "Canada", "Netherlands"]
    }
  },
  "allOf": [
    {
      "if": {
        "properties": { "country": { "const": "US" } }
      },
      "then": {
        "properties": { "postal_code": { "pattern": "[0-9]{5}(-[0-9]{4})?" } }
      }
    },
    {
      "if": {
        "properties": { "country": { "const": "Canada" } }
      },
      "then": {
        "properties": { "postal_code": { "pattern": "[A-Z0-9]{6}" } }
      }
    },
    {
      "if": {
        "properties": { "country": { "const": "Netherlands" } }
      },
      "then": {
        "properties": { "postal_code": { "pattern": "[0-9]{4} [A-Z]{2}" } }
      }
    }
  ]
}
```

# 使用布尔逻辑应用子模式的关键字

## allOf

这个关键字的值必须是一个非空数组，并且数组中的每一个元素必须是一个有效的JSON模式。

如果一个实例成功通过这个关键字指定的所有JSON模式，则验证通过。

例如，我们有两个JSON模式，它们分别验证实例是否属于字符串和实例的长度是否大于等于5。如果我们要验证一个实例同时满足这两个JSON模式，我们可以使用 allOf 关键字来将两个JSON模式组合起来，只有实例成功通过了如下所示：

```json
{
    "allOf": [
        {"type": "string"},
        {"minLength": 5}
    ]
}
```

## anyOf

这个关键字的值必须是一个非空数组，并且数组中的每一个元素必须是一个有效的JSON模式。

如果一个实例成功通过了这个关键字指定的至少一个JSON模式的验证，则验证通过。

我们用如下一个JSON模式验证一个实例是否能满足是字符串，值在"Ruby"、“Java”、“Swift” 之中，值等于 “Python” 这三个条件中至少一个条件：

```json
{
  "anyOf": [
    {"type": "string"},
    {"enum": ["Ruby", "Java", "Swift"]},
    {"const": "Python"}
  ]
}
```

## oneOf

这个关键字的值必须是一个非空数组，并且数组中的每一个元素必须是一个有效的JSON模式。

如果一个实例成功通过了这个关键字指定的其中一个JSON模式的验证，则验证通过。

我们用如下一个JSON模式验证一个实例是否是字符串、对象或者数组之一：

```json
{
  "oneOf": [
    {"type": "string"},
    {"type": "object"},
    {"type": "array"}
  ]
}
```

## not

这个关键字的值必须是一个有效的JSON模式。

如果一个实例对于这个关键字指定的JSON模式验证失败，则验证通过。

我们用如下的JSON模式表示不允许字符串实例：

```json
{
  "not": {"type": "string"}
}
```

# 用于验证语义的关键字 “format”

仅进行结构验证可能不足以验证实例是否满足应用程序的所有需求。定义 format 关键字是为了允许对权威资源（无论是 rfc 还是其他外部规范）精确描述的固定值子集进行互操作语义验证。

这个关键字的值称为格式属性，必须是 string 类型。format 属性通常只能验证给定的一组实例类型。如果要验证的实例类型不在此集合中，则此格式属性和实例的验证应该成功。

已定义的格式有如下几种，并且这些属性只应用于字符串类型的实例：

## 日期和时间

date
time
datetime

## 电子邮件地址

email
idn-email

## 主机名

hostname
idn-hostname

## IP地址

ipv4
ipv6

## 资源标识符

uri
uri-reference
iri
iri-reference

## URI模版

uri-template

## JSON指针

json-pointer
relative-json-pointer

## 正则表达式

regex

# 其他关键字

# 注释关键字

除了以上介绍的那些用于验证的关键字，JSON模式中还可以使用其他一些用于描述JSON模式本身的注释关键字，这些关键字并不是必须的，而是一种最佳实践，包含这些关键字的JSON模式可以变成 自描述的。

则可以是他们有以下几个：

## title

值必须是字符串类型，表示JSON模式的名称，应该尽量简短。

## description

值必须是字符串类型，用于描述JSON模式的用途。

## defualt

指定项的默认值。尽管许多JSON模式验证器会忽略这个关键字，但是在可能的情况下，JSON处理器可以使用此关键字的值为丢失的键值对提供默认值。

## examples

这个关键字的值必须是一个数组，提供一组满足JSON模式的实例，用于向读者解释JSON模式的作用和效果。

## $comment

这个关键字完全是为了用于向JSON模式源添加注释。此关键字的值必须是字符串。

下面是一个包含上述关键字的示例：

```json
{
  "title" : "Match anything",
  "description" : "This is a schema that matches anything.",
  "default" : "Default value",
  "examples" : [
    "Anything",
    "__init__"
  ]，
  "$comment": "this is a comment keyword"
  "type": "string",
  "pattern": "[a-zA-Z0-9_]{3,10}"
}
```

# “$schema” 关键字

$schema 关键字用于声明JSON片段实际上是JSON模式的一部分。它还声明了针对哪个版本的JSON模式标准编写模式。

建议在JSON模式的根下都包含一个 $schema 条目。入下所示：

```json
"$schema": "http://json-schema.org/schema#"
```


如果需要声明一个JSON模式是针对特定版本的JSON模式标准编写的，应该在路径中包含草案名称，例如针对JSON模式草案7编写的JSON模式，应该像下面这样写：

```json
"$schema": "http://json-schema.org/draft-07/schema#"
```



如果你自己拓展了JSON模式语言，使其包含用于验证值的自定义关键字，则可以为 $schema 指定自定义的URI。但是自定义的URI不能与下面几个相同：

http://json-schema.org/draft-07/schema#
http://json-schema.org/draft-06/schema#
http://json-schema.org/draft-04/schema#

# “$id” 属性和 “$ref” 属性

## $id 属性

$id 属性的作用有两个：

- 为JSON模式声明一个唯一标识符
- 声明了一个解析*$ref* 的URI时的基础URI。

最佳实践是，每个顶级JSON模式都应该将 $id 设置为一个由你自己控制的域内的绝对URI。例如，如果你拥有 foo.bar 这个域，并且你有一个表示地址的JSON模式，你可以将这个JSON模式的 $id 属性值设置为：

```json
{ "$id": "http://foo.bar/schemas/address.json" }
```


这样，就为JSON模式设置了一个唯一的标识符，在大多数情况下，这个URI还指示了应该在何处下载包含这个模式的JSON文件。

$id 属性的第二个用途是，它为JSON模式文件中其他位置的相对 $ref URL声明了一个基本URL。例如，如果表示地址的JSON模式中包含如下的 $ref 属性：

```json
{ "$ref": "person.json" }
```

支持网络抓取的JSON模式验证库将把 $ref 的值解析为 http://foo.bar/schemas/person.json ，并从这个地址抓取 person.json 这个文件，而不管表示地址的这个JSON模式文件本身是从哪儿加载的。

$id 属性也可以设置为一个相对URI，用来被同一个JSON模式文件内的 $ref 属性引用（请参考下面 definitions 关键字的例子）。

## $ref 属性

$ref 属性用来引用同一个JSON模式文件或其他JSON模式文件中的JSON模式片段，这个属性的值通常是一个相对或者绝对URI，# 符号后面的部分是JSON指针。JSON模式验证库在解析 $ref 属性时，$ref 属性本身将在逻辑上被其值指向的JSON模式片段替换。

$ref 属性可以用在JSON模式中的任何地方，也可以用作一个对象内的唯一的键（这种情况下，这个对象内的其他属性将被验证器忽略）

# definitions 关键字

这个关键字可以在JSON模式中定义一个可以在这个JSON模式中被引用的JSON子模式。下面的例子中，我们先定义一个地址的子模式，然后在表示商家地址的JSON模式中引用这个子模式：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city":           { "type": "string" },
        "state":          { "type": "string" }
      },
      "required": ["street_address", "city", "state"]
    }
  },
  "type": "object",
  "properties": {
    "billing_address": { "$ref": "#/definitions/address" },
    "shipping_address": { "$ref": "#/definitions/address" }
  }
}
```





