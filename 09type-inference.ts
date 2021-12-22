// 类型推论
// 没有明确之处类型的地方，类型推论会帮助提供类型
{
    let x = 3;

    // 最佳通用类型
    // 需要从几个表达式中推断类型时候，会使用这些表达式的类型来推断出一个合适的通用类型
    let xs = [0, 1, null];
    // 这里类型有两种选择：number 和 null。计算通用类型算法会考虑所有的候选类型，给一个兼容所有候选类型的类型
    // 由于最终的通用类型从候选类型中选取，有时候候选类型共享相同的通用类型
    // 但是没有一个类型能做为所有候选类型的类型
    let zoo = [new Rhino(), new Elephanat(), new Snake()];
    // 想让 zoo 被推断为 Animal[] 类型，但数组没有对象是 Animal 类型，因此不能推断出
    // 此时要明确指出
    let zoo2: Array<Animal> = [new Rhino(), new Elephanat(), new Snake()];
    // 如果没有找到最佳通用类型，就会推断为联合数组类型 (Rhino | Elephant | Snake)[]
}

// 上下文类型
// 函数表达式有明确的参数类型注解，上下文类型被忽略
// Ts 类型检查器使用Window.onmousedown函数的类型来推断右边函数表达式的类型。 因此，就能推断出 mouseEvent参数的类型了
{
    window.onmousedown = function(mouseEvent) {
        console.log(mouseEvent.button); // <- Error
    };
}
// 上下文归类会在很多情况下使用到。 通常包含函数的参数，赋值表达式的右边，类型断言，对象成员和数组字面量和返回值语句。 上下文类型也会做为最佳通用类型的候选类型
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}

