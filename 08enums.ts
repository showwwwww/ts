// 枚举
// 数字枚举
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
// 定义了 Up 并初始化为 1，其余成员会从 1 开始自动增长，Right 为 4
// 不使用初始化器
enum Direction2 {
    Up,
    Down,
    Left,
    Right
}
// 现在 Up 的值 为 0

// 通过枚举的属性来访问美剧成员，和枚举的名字来访问枚举类型:
enum Res {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Res): void {
    // ...
}
respond("Princess Caroline", Res.Yes);

// 数字枚举可以被混入到计算过的常量成员。不带初始化器的枚举或者被放在第一的位置，或者被放在使用了数字常量或其他常量初始化了的枚举后面。
enum E {
    A = getSomeValue(),
    B, // 错误，A 使用了非常量初始化器，所以B需要一个初始化器
}

// 字符串枚举
// 字符串枚举没有自增行为，字符串枚举可以很好的序列化
enum DirectionString {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "Right",
}

// 异构枚举
// 枚举混合字符串和数字
enum BooleanLikeHecterogenerousEnum {
    No = 0,
    Yes = "yes"
}

// 计算和常量成员
// 枚举的第一个成员且没有初始化器，这种情况下被赋值为 0
// 不带初始化器且之前的枚举成员是一个数字常量，这种情况下自增 1
// 枚举成员使用常量枚举表达式初始化。常熟枚举表达式时 TS 表达式的子集，它在编译阶段求值
// 当一个表达式满足下面条件之一，它就是一个常量枚举表达式：
// 字符串字面量或数字字面量、对之前定义的常量成员的引用（可以是不同枚举类型中）、带括号的常量枚举表达式
// 一元运算符 +、-、~ 其中之一应用在了常量枚举表达式
// 常量美剧表达式做为二元运算符 +、-、*、/、%、<<、>>、>>>、&、|、^的操作对象。若求值后为 NaN 或 Infinity，则在编译阶段报错
// 其他情况枚举成员被当作需要计算得出的值

// 联合枚举和枚举成员的类型
// 枚举成员成为了类型,某些成员只能是枚举成员的值
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}

// 枚举类型本身变成了每个枚举成员的联合
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
    }
}

// 运行时枚举
// 枚举是在运行时真正存在的对象

enum S {
    X, Y, Z
}

function ff(obj: { X: number }) {
    return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
ff(S);

// 反向映射
// 创建一个以属性名做为对象成员的对象之外，数字枚举成员还具有了反向映射，从枚举值到枚举名字
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
// JS 代码为
var Enums;
(function (Enums) {
    Enums[Enums["A"] = 0] = "A";
})(Enums || (Enums = {}));
var a1 = Enums.A;
var nameOfA1 = Enums[a]; // "A"

// const 枚举
// 避免在额外胜场的代码是的开销和额外的非直接的对枚举成员的访问.
{
    const enum Enum {
        A = 1,
        B = A * 2
    }

    const enum Directions {
        Up,
        Down,
        Left,
        Right
    }
    
    let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
}

// 外部枚举
// 外部枚举用来描述已经存在的枚举类型的形状
declare enum Enum {
    S = 1,
    B,
    C = 2
}
// 正常枚举里，没有初始化器的成员当成常数成员，对于非常数的外部枚举而言，没有初始化方法被当作需要计算的成员