// Symbol 介绍
{
    let sym1 = Symbol();
    let sym2 = Symbol("key"); // 可选的字符串 key

    // Symbol 是不可改变且唯一的
    let sym3 = Symbol("key");
    sym2 === sym3; // false，symbols 是唯一的

    // 像字符串一样，symbol 也可以被用做对象属性的键
    let sym4 = Symbol();
    let obj = {
        [sym4]: "value"
    };
    console.log(obj[sym4]); // "value"

     const getClassNameSymbol = Symbol();
     class C {
         [getClassNameSymbol]() {
             return "C";
         }
     }
     let c = new C();
     let className = c[getClassNameSymbol](); // "C"
}

// 内置 Symbols
{
    // 被 instanceof 运算符调用，构造器对象用来识别一个对象是否是其实例
    Symbol.hasInstance

    // 布尔值，标识在一个对象上调用 Array.prototype.concat 时，这个对象的数组元素是否可展开
    Symbol.isConcatSpreadable

    // 被 for-of 语句调用。返回对象的默认迭代器。
    Symbol.iterator

    // 被 String.prototype.match 调用，正则表达式用来匹配字符串
    Symbol.match

    // 被 String.prototype.replace 调用，正则表达式用来替换字符串中匹配的子串
    Symbol.replace

    // 被 String.prototype.search 调用，正则表达式返回被匹配部分的字符串中的索引
    Symbol.search

    // 函数值，为一个构造函数，用来创建派生对象
    Symbol.species

    // 被 String.prototype.split 调用，正则表达式用来分割字符串
    Symbol.split

    // 被 ToPrimitive 抽象操作调用，把对象转换为相应的原始值
    Symbol.toPrimitive

    // 被内置方法 Object.prototype.toString 调用，返回创建对象时默认的字符串描述
    Symbol.toStringTag

    // 对象，它自己拥有的属性会被 with 作用域排除在外
    Symbol.unscopables
}