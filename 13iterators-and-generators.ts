// 可迭代性
{
    // 当一个对象实现了 Symbol.iterator 属性时，我们认为它时可迭代的。
    // for..of 语句
    let someArray = [1, "string", false];

    for (let entry of someArray) {
        console.log(entry); // 1, "string", false
    }

    // for..of vs. for..in 语句
    // for..in 迭代的是对象的键的列表
    for (let i in someArray) {
        console.log(i); // "0", "1", "2"z
    }

    // for..in 可以操作任何对象；它提供了查看对象属性的一种方法
    // for..of 关注迭代对象的值，通过 Symbol.iterator 可以访问
}