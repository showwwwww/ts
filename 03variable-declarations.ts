// IIFE 立即执行函数
// 形成一个闭包，外部无法访问其中的变量
for(var i = 0; i < 10; i++) {
    ((i) => setTimeout(() => console.log(i), 0))(i);
}
// 函数声明
type C = { a: string, b?: number };
function f({ a, b = 0 } = { a: '' }): void {
    // ...
}
f( { a: "yes" }); // ok, default b = 0
f(); // ok, default to {a: ""}, which then defaults b = 0
f({}); // error, 'a' is required if you supply an argument

// 解构指定默认值
function f2({ a = '', b = 0 } = {}): void {
    // ...
}

// 对象展开会丢失其方法，并且从左至右进行处理，后面的属性会覆盖前面的属性