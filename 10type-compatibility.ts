// 类型兼容
// TS 里的类型兼容是基于结构子类型的
// 结构类型是一种只使用其成员来描述类型的方式
// 正好与名义(nominal)类型形成对比
// 基于名义类型的类型系统中，数据类型的兼容或等价性是通过明确的声明或类型的名称来决定的
// 而结构类型是基于类型的组成结构，且不要求明确声明
{
    interface Named {
        name: string;
    }

    class Person {
        name: string;
    }

    let p: Named;
    // OK, because of structural typing
    p = new Person();
    // 这在 Java 中会报错，因为 Person 类没有明确说明实现了 Named 接口
    // TS 的结构性子类型是根据 JS 代码典型写法设计。
}

// 开始
// TS 结构化类型系统的基本规则是，如果 x 要兼容 y，那么 y 至少具有与 x 相同的属性
{
    interface Named {
        name: string;
    }

    let x: Named;
    // y's inferred type is { name: string; location: string; }
    let y = { name: "Alice", location: "Seattle" };
    x = y;

    // 检查函数参数时使用相同的规则：
    function greet(n: Named) {
        console.log("Hello, " + n.name);
    }
    greet(y); // OK
    // 递归检查每个成员及子成员
}

// 比较两个函数
{
    let x = (a: number) => 0;
    let y = (b: number, s: string) => 0;

    y = x; // OK
    x = y; // Error
    // x 的每个参数在 y 中都能找到对应的参数
    // y 的第二个参数在 x 中没有，所以错误
    let x2 = () => ({ name: "Alice" });
    let y2 = () => ({ name: "Alice", location: "Seattle" });

    x2 = y2; // OK
    y2 = x2; // Error, because x2() lacks a location property 
    // 类型系统强制源函数返回值类型必须是目标函数返回值类型的子类型
}

// 函数参数双向协变
{
    enum EnventType { Mouse, Keyboard }
    
    interface Event { timestamp: number; }
    interface MouseEvent extends Event { x: number; y: number }
    interface KeyEvent extends Event { keyCode: number }

    function listenEvent(EnventType: EnventType, handler: (n: Event) => void) {
        // ...
    }

    listenEvent(EnventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

    listenEvent(EnventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
    listenEvent(EnventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

    listenEvent(EnventType.Mouse, (e: number) => console.log(e));
}

// 可选参数及剩余参数
// 比较函数兼容性时，可选参数与必须参数时可互换的
// 源类型上有额外的可选参数不是错误，目标类型的可选参数在源类型里没有对应的参数也不是错误
// 当一个函数有剩余参数时，它被当做无限个可选参数
// 从运行时角度来看，可选参数一般不是强制的，对于大多数函数来说相当于传了一些 undefined 不稳定
{
    function invokeLater(args: any[], callback: (...args: any[]) => void) {

    }

    // Unsound - invokeLater "might" provide any number of arguments
    invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

    // Confusing (x and y are actually required) and undiscoverable
    invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
}

// 函数重载
// 对于有重载的函数，源函数的每个重载都要在目标函数上找到对应的函数签名。
// 确保了目标函数可以在所有源函数可调用的地方调用

// 枚举
// 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的
{
    enum Status { Ready, Waiting };
    enum Color { Red, Blue, Green };

    let status = Status.Ready;
    status = Color.Green; // Error
}

// 类
// 类与对象字面量和接口差不多，但：类有静态部分和实例部分的类型
// 比较两个类类型的对象时，只有实例的成员会被比较。静态成员和构造函数不在比较范围内
{
    class Animal {
        feet: number;
        constructor(name: string, numFeet: number) { }
    }

    class Size {
        feet: number;
        constructor(numFeet: number) { }
    }

    let a: Animal;
    let s: Size;

    a = s; // OK
    s = a; // OK
    // 类的私有成员和受保护成员
    // 类的私有成员和受保护成员会影响兼容性。
    // 如果目标类型包含一个私有成员，那么源类型必须包含来自同一个类的私有成员
    // 这允许子类赋值给父类，但不能赋值给其他有同样类型的类
}

// 泛型
// TS 是结构性的类型系统,类型参数只影响使用其作为类型一部分的结构
{
    interface Empty<T>{

    }
    let x: Empty<number>;
    let y: Empty<string>;

    x = y; // Ok, because y matches structure of x


    interface NotEmpty<T> {
        data: T;
    }
    let x2: NotEmpty<number>;
    let y2: NotEmpty<string>;
    
    x2 = y2;  // Error, because x and y are not compatible

    // 对于没指定泛型类型的泛型参数时，会把所有泛型参数当成any比较。
    // 然后用结果类型进行比较，就像上面第一个例子
    let identity = function<T>(x: T): T {
        // ...
    }
    
    let reverse = function<U>(y: U): U {
        // ...
    }
    
    identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
}

// 子类型与赋值
// TS 里，有两种兼容性：子类型和赋值。 它们的不同点在于，赋值扩展了子类型兼容性，增加了一些规则
// 允许和any来回赋值，以及enum和对应数字值之间的来回赋值。
// 类型兼容是由赋值兼容来控制的,即使在 implements 和 extends 语句也不例外