// 高级类型
// 交叉类型
// 交叉类型是将多个类型合并为一个类型。 
// 把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性
{
    function extend<T, U>(first: T, second: U): T & U {
        let result = <T & U> {};
        for (let id in first) {
            (<any>result[id]) = (<any>first)[id];
        }
        for (let id in second) {
            if (!result.hasOwnProperty(id)) {
                (<any>result)[id] = (<any>second)[id];
            }
        }
        return result;
    }

    class Person {
        constructor(public name: string) {}
    }

    interface Loggable {
        log(): void;
    }

    class ConsoleLogger implements Loggable {
        log() {
            // ...
        }
    }

    var jim = extend(new Person("Jim"), new ConsoleLogger());
    var n = jim.name;
    jim.log();
}

// 联合类型
// 联合类型表示一个值可以是几种类型之一 
// 例如：我们用竖线（ |）分隔每个类型，所以 number | string | boolean表示一个值可以是 number， string，或 boolean。
{
    /**
     * Takes a string and adds "padding" to the left.
     * If 'padding' is a string, then 'padding' is appended to the left side.
     * If 'padding' is a number, then that number of spaces is added to the left side.
     */
    function padLeft(value: string, padding: string | number) {
        // ...
    }

    let indentedString = padLeft("Hello world", true); // errors during compilation

    // 如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
    interface Bird {
        fly();
        layEggs();
    }
    
    interface Fish {
        swim();
        layEggs();
    }
    
    function getSmallPet(): Fish | Bird {
        // ...
    }
    
    let pet = getSmallPet();
    pet.layEggs(); // okay
    pet.swim();    // errors
}

// 类型保护和区分类型
{
    interface Fish {
        swim();
        layEggs();
    }

    interface Bird {
        fly();
        layEggs();
    }
    // 可以使用类型断言来解决联合类型调用问题
    // 自定义类型保护
    //  类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。
    // 类型保护就是简单地定义一个函数，它的返回值是一个类型谓词
    function isFish(pet: Fish | Bird): pet is Fish {
        return (<Fish>pet).swim !== undefined;
    }
    // pet is Fish就是类型谓词。
    // 谓词为 parameterName is Type 这种形式， parameterName必须是来自于当前函数签名里的一个参数名

    // typeof 类型保护
    function isNumber(x: any): x is number {
        return typeof x === "number";
    }
    
    function isString(x: any): x is string {
        return typeof x === "string";
    }
    
    function padLeft2(value: string, padding: string | number) {
        if (isNumber(padding)) {
            return Array(padding + 1).join(" ") + value;
        }
        if (isString(padding)) {
            return padding + value;
        }
        throw new Error(`Expected string or number, got '${padding}'.`);
    }
    // typeof类型保护*只有两种形式能被识别： typeof v === "typename"和 typeof v !== "typename"， "typename"必须是 "number"， "string"， "boolean"或 "symbol"。 
    // 但是 ts 并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护

    // instanceof 类型保护
    // instanceof的右侧要求是一个构造函数，TypeScript将细化为：
    // 此构造函数的 prototype属性的类型，如果它的类型不为 any的话
    // 构造签名所返回的类型的联合

    // 可以为 null 的类型
    // 默认情况下，类型检查器认为 null 与 undefined 可以赋值给任何类型

    // 可选参数和可选属性
    // 使用了 --strictNullChecks，可选参数会被自动地加上 | undefined

    // 类型保护和类型断言
    // 如果编译器不能够去除 null或 undefined，你可以使用类型断言手动去除。 语法是添加 !后缀： identifier!从 identifier的类型里去除了 null和 undefine
    function broken(name: string | null): string {
        function postfix(epithet: string) {
          return name.charAt(0) + '.  the ' + epithet; // error, 'name' is possibly null
        }
        name = name || "Bob";
        return postfix("great");
      }
      
      function fixed(name: string | null): string {
        function postfix(epithet: string) {
          return name!.charAt(0) + '.  the ' + epithet; // ok
        }
        name = name || "Bob";
        return postfix("great");
      }
}

// 类型别名
// 类型别名会给一个类型起个新名字
{
    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;
    function getName(n: NameOrResolver): Name {
        if (typeof n === "string") {
            return n;
        } else {
            return n();
        }
    }

    // 类型别名也可以是泛型
    type Container<T> = { value: T };
    type Tree<T> = {
        value: T;
        left: Tree<T>;
        right: Tree<T>;
    }

    type LinkedList<T> = T & { next: LinkedList<T> };

    interface Person {
        name: string;
    }

    let people: LinkedList<Person>;
    var s = people.name;
    var s = people.next.name;
    var s = people.next.next.name;
    var s = people.next.next.next.name;
}

// 接口 vs 类型别名
// 接口创建了一个新的名字，可以在其它地方使用
// 类型别名并不创建新名字
type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
// 另一个重要区别是类型别名不能被 extends 和 implements(自己也不能 extends 和 implements 其他类型)
// 软件中地对象应该对于扩展时开放地，对于修改是封闭的
// 尽可能使用接口代替类型别名

// 字符串字面量类型
{
    type Easing = "ease-in" | "ease-out" | "ease-in-out";
    class UIElement {
        animate(dx: number, dy: number, easing: Easing) {
            if (easing === "ease-in") {
                // ...
            }
            else if (easing === "ease-out") {
            }
            else if (easing === "ease-in-out") {
            }
            else {
                // error! should not pass null or undefined.
            }
        }
    }

    let button = new UIElement();
    button.animate(0, 0, "ease-in");
    button.animate(0, 0, "uneasy"); // error: "uneasy" is not allowed here

    function createElement(tagName: "img"): HTMLImageElement;
    function createElement(tagName: "input"): HTMLInputElement;
        // ... more overloads ...
    function createElement(tagName: string): Element {
        // ... code goes here ...
    }
}

// 数字字面量类型
{
    function rollDie(): 1 | 2 | 3 | 4 | 5 | 6 {
        //...
    }
}

// 枚举成员类型
// 当每个枚举成员都是用字面量初始化的时候枚举成员是具有类型的

// 可辨识联合
// 合并 单例类型、联合类型、类型保护 和 类型别名来创建一个 可识别联合
// 也被称为标签联合 或 代数数据类型
// 具有普通的单例类型属性 - 可辨识的特征
// 一个类型别名包含了那些类型的联合 - 联合
// 此属性上的类型保护
{
    interface Square {
        kind: "square";
        size: number;
    }

    interface Rectangle {
        kind: "rectangle";
        width: number;
        height: number;
    }

    interface Circle {
        kind: "circle";
        radius: number;
    }

    interface Triangle {
        kind: 'triangle';
        bottom: number;
        height: number;
    }

    type Shape = Square | Rectangle | Circle | Triangle;

    // 完整性检查
    // 让编译器通知添加
    function area(s: Shape) {
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.height * s.width;
            case "circle": return Math.PI * s.radius ** 2;
        }
        // should error here - we didn't handle case "triangle"
    }

    // 方案1
    // 启用 --strictNullChecks 并指定一个返回类型
    function area1(s: Shape): number { // errors: returns number | undefined
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.height * s.width;
            case "circle": return Math.PI * s.radius ** 2;
        }
    }

    // 方案2
    // 使用 never 类型
    function assertNever(x: never): never {
        throw new Error("Unexpected object: " + x);
    }
    function area2(s: Shape) {
        switch (s.kind) {
            case "square": return s.size * s.size;
            case "rectangle": return s.height * s.width;
            case "circle": return Math.PI * s.radius ** 2;
            default: return assertNever(s); // error here if there are missing cases
        }
    }
}

// 多态的 this 类型
// 多态的 this 类型标识的某个包含类或接口的子类型。这被称为 F-bounded 多态性
// 很容易表现连贯接口简的继承
{
    class BasicCaculator {
        public constructor(protected value: number = 0) { }
        public currentValue(): number {
            return this.value;
        }
        public add(operand: number): this {
            this.value += operand;
            return this;
        }
        public multiply(operand: number): this {
            this.value *= operand;
            return this;
        }
        // ... other operations go here ...
    }

    let v = new BasicCaculator(2)
                .multiply(5)
                .add(1)
                .currentValue();

    // 继承这个类，新的类可以直接使用之前的方法
    class ScientificCaculator extends BasicCaculator {
        public constructor(value = 0) {
            super(value);
        }
        public sin() {
            this.value = Math.sin(this.value);
            return this;
        }
        // ... other operation go here ...
    }

    let v2 = new ScientificCaculator(2)
            .multiply(5)
            .sin()
            .add(1)
            .currentValue();
    // 如果没有 this 类型，ScientificCaculator 就不能在 BasicCalculator 的同时还保持接口的连贯性
    // multiply 将会返回 BasicCaculator，它并没有 sin 方法。
    // 然而使用 this 类型，multiply 会返回 this，在这里就是 ScientificCaculator
}

// 索引类型
// 使用索引类型，编译器就能够检查使用了动态属性名的代码
{
    function pluck<T, K extends keyof T>(o: T, names: K[]): Array<T[K]> {
        return names.map(n => o[n]);
    }

    interface Person {
        name: string;
        age: number;
    }

    let person: Person = {
        name: "Jarid",
        age: 35
    };

    let strings: string[] = pluck(person, ["name"]); // ok, string []

    let personProps: keyof Person; // "name" | "age"
    pluck(person, ["age", "unknown"]); // error, "unknown" is not "name" | "age"

    // 索引访问操作符
    function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
        return o[name]; // o[name] is of type T[K]
    }

    let name: string = getProperty(person, "name");
    let age: number = getProperty(person, "age");
    let unknown = getProperty(person, "unknown"); // error, "unknown" is not in "name" | "age"

    // 索引类型和字符串索引签名
    interface Map<T> {
        [key: string]: T;
    }

    let keys: keyof Map<number>; // string
    let values: Map<number>["foo"]; // number
}

// 映射类型
{
    interface Person {
        name: string;
        age: number;
    }

    interface PersonPartial {
        name?: string;
        age?: number;
    }

    interface PersonReadonly {
        readonly name: string;
        readonly age: number;
    }

    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    }
    type Partial<T> = {
        [P in keyof T]?: T[P];
    }

    type PersonPartial1= Partial<Person>;
    type ReadonlyPerson = Readonly<Person>;

    type Keys = 'option1' | 'option2';
    type Flags = { [K in Keys]: boolean };

    // 内部使用了 for .. in
    // 1、类型变量 K，它会依次绑定到每个属性
    // 2、字符串字面量联合的 Keys，它包含了要迭代的属性名的集合
    // 3、属性的结果类型

    // 由映射类型进行推断
    function unproxify<T>(t: Proxify<T>): T {
        let result = {} as T;
        for (const k in t) {
            result[k] = t[k].get();
        }
        return result;
    }
    
    let originalProps = unproxify(proxyProps);
    // 拆包推断只使用于同态的映射类型。如果映射类型不是同态的，那么需要拆包函数一个明确的类型参数
    //     预定义的有条件类型
    // TypeScript 2.8在lib.d.ts里增加了一些预定义的有条件类型：

    // Exclude<T, U> -- 从T中剔除可以赋值给U的类型。
    // Extract<T, U> -- 提取T中可以赋值给U的类型。
    // NonNullable<T> -- 从T中剔除null和undefined。
    // ReturnType<T> -- 获取函数返回值类型。
    // InstanceType<T> -- 获取构造函数类型的实例类型。
}