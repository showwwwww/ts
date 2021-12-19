// 接口
interface LabelledValue {
    label: string;
}

// 接口只会关注值的外形，只要传入得对象满足，就是被允许得
// 类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。
function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 object" };
printLabel(myObj);

// 可选属性
// 接口里的属性不全都是必须的
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: "white", area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: "black" });

// 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
// 把整个 ReadonlyArray 赋值到一个普通数组是不可以的，但是可以用类型断言重写
a = ro as number[];
// 变量用 const 属性用 readonly
// 当使用可选属性时，TS 会进行额外属性检查，即超出的定义范围之外得属性会报错
// 绕开额外属性检查可以使用类型断言
interface Circle {
    width?: number;
    height?: number;
}

function createCircle(circle: Circle): { width: number, height: number } {
    return { width: circle.width, height: circle.height };
}
let mySquare2 = createCircle({ width: 100, opacity: 0.5 } as Circle);
// 但最佳方式是添加一个字符串索引标签名，如果能够确定这个对象可能具有某些特殊用途使用的额外属性。
interface Triangle {
    width?: number;
    height?: number;
    [propName: string] : any
}

// 最后一种跳过额外属性检查的方式是：将对象赋值给另一个变量
let circle = { colour: "red", width: 100 };
let myCircle = createCircle(circle);

// 函数类型
// 接口除了描述 JS 中对象拥有的各种各样的外形外，还可以描述函数类型
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
// 对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配。
// 函数的参数回逐个进行检查，要求对应位置上的参数类型师兼容的。如果不想指定类型，TS 的类型系统会推断出参数类型。
// 函数的返回值类型也是通过其返回值推断出来的

// 可索引的类型
// 与使用接口描述函数类型差不多，也可以描述那些能够“通过索引得到”的类型，比如 a[0] 或 ageMap["daniel"]
// 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];

// Ts 支持两种索引签名: 字符串和数字。可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
// 因为当使用 number 来索引时，JS 会将它转换成 string 然后再去索引对象。
class Animal {
    name: string;
}

class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的 Animal
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}

// 字符串索引签名能够很好的描述 dictionary 模式，并且它们也会确保保护所有属性与其返回类型相匹配。
// 因为字符串索引声明了 obj.property 和 obj["property"] 两种形式都可以。
interface NumberDictionary {
    [index: string]: number;
    length: number; // 可以，length 是 number 类型
    name: string; // 错误，'name' 的类型与索引类型返回值的类型不匹配
}

// 最后，可以将索引签名设置为只读，这样就防止给索引赋值
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray2: ReadonlyStringArray = ["Alice", "Bob"];
myArray2[2] = "Mallory"; // error

// 类类型
// 实现接口，与 C# 或 Java 里接口的基本作用一样，Ts 也能够用它来明确的强制一个类去符合某种契约。
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

interface PetInterface {
    currentName: string;
    setName(n: string);
}

class Pet implements PetInterface {
    currentName: string;
    setName(n: string) {
        this.currentName = n;
    }
    constructor(firstName: string, lastName: string) { }
}
// 当一个类实现一个接口时，只对实例部分进行类型检查。constructor 属于类的静态部分，所以不在检查范围内。

interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface2;
}
interface ClockInterface2 {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface2 {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface2 {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}

class AnalogClock implements ClockInterface2 {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tick");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

// 接口继承
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;

// 一个接口可以继承多个接口，创建出多个接口的合成接口
interface Shape2 {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Diamond extends Shape2, PenStroke {
    sideLength: number;
}

let diamond = {} as Diamond;
diamond.color = "blue";
diamond.sideLength = 10;
diamond.penWidth = 5.0;

// 混合类型
// 一个对象可以同时做为函数和对象使用，并带有额外的属性
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function() {};
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

// 接口继承类
// 当接口继承了一个类类型时，它会继承类的成员但不包括其实现。就好像接口声明了所有类中存在的成员，
// 但并没有提供具体实现一样。接口同样会继承到类的 private 和 protected 成员。
// 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其字类所实现（implement)
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {}
}

//  错误：“Image” 类型缺少 “state" 属性。
class Image implements SelectableControl {
    select() {}
}