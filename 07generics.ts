// 泛型
function identity<T>(arg: T): T {
    return arg;
}

let output = identity<string>("myString"); // type of output will be 'string'
let output2 = identity("myString"); // type of output will be 'string'
// 大部分情况下编译器能够自动推断出类型，所以不需要用 <> 明确指出

// 使用泛型变量
// 泛型函数接受类型参数 T 和 参数 arg，它是个元素类型是 T 的数组，并返回元素类型是 T 的数组
// 我们可以把泛型变量 T 当做类型的一部分使用，而不是整个类型，增加了灵活性。
function loggingIndentity<T>(arg: T[]): T[] {
    console.log(arg.length);
    return arg;
}

function loggingIndentity2<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);
    return arg;
}

function generalFn(arg: number): string {
    return arg.toString();
}

// 泛型类型
let myIdentity: <T>(arg: T) => T = identity;

let myIdentity2: <U>(arg: U) => U = identity;

// 带有签名的对象字面量
let myIdentity3: {<T>(arg: T): T} = identity;

let test: {(arg: number): string} = generalFn;

interface GenericIdentityFn {
    <T>(arg: T): T;
}

let myIdentity4: GenericIdentityFn = identity;

// 把泛型参数当作整个接口的一个参数
interface GenericIdentityFn2<T> {
    (arg: T): T;
}

function identity2<S>(arg: S): S {
    return arg;
}

let myIdentity5: GenericIdentityFn2<number> = identity2;
// 除了泛型接口，我们还可以创建泛型类。注意，无法创建泛型枚举和泛型命名空间。

// 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y };

// 泛型类
class GenericNumberClass<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumberClass = new GenericNumberClass<number>();
myGenericNumberClass.zeroValue = 0;
myGenericNumberClass.add = function(x, y) { return x + y };
// 类有两部分：静态部分和实例部分。泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型

// 泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// 用泛型继承接口，在接口中做泛型约束
// 在泛型约束中使用类型参数
// 声明一个被另一个类型参数所约束的类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
getProperty(x, 'm');

// 在泛型里使用类类型
// 在 TS 使用泛型创建工厂函数时，需要引用构造函数的类类型
function create<T>(c: { new(): T; }): T {
    return new c();
}

// 使用原型属性推断并约束构造函数与类实例的关系
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag; // typechecks!
createInstance(Bee).keeper.hasMask; // typechecks!