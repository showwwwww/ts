// 继承
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Silthering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) {
        super( name);
    }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);

// 派生类的构造函数必须调用 super()，它会执行基类的构造函数
// 并且，在构造函数里访问 this 的属性之前，一定要调用 super()

// 公共，私有与受保护的修饰符
// 默认为 public
// private，当成员被标记成 private 时，它就不能在声明它的类的外部访问。
// TS 使用的是结构性类型系统，当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型时兼容的
// 然而，当我们比较带有 private 和 protected 成员的类型的时候，情况就不同了。如果其中一个类型里包含一个 private 成员，那么只有当另一个类型中也存在这样一个 private 成员，并且它们都是来自同一处声明时，我们才认为这两个类型时兼容的。对于 protected 成员也适用这个规则。
class Person {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Person {
    constructor() { super("Rhino"); }
}

class Employee {
    name: string;
    constructor(theName: string) { this.name = theName; }
}

class Boss {
    name: string;
    age: number;
    constructor(name: string, age: number) { this.name = name; this.age = age }
}

let person = new Person("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");
let boss = new Boss("show", 17);

person = rhino;
person = employee; // 错误：Person 和 Employee 不兼容
boss = employee; // 错误：Employee 类中缺少 age 属性
employee = boss; // 正确
// 虽然 Employee 类和 Person 类看上去相似，但其中两个 private 变量是不同的
// 另外类不会做额外属性检查，因此赋值时只要包含关系即可成功

// protected 和 private 区别在于，protected 可以再派生类中访问，而 private 在派生类中只能通过调用父类的方法访问
class Goods {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Vegetables extends Goods {
    private price: string;
    constructor(name: string, price: string) {
        super(name);
        this.price = price;
    }

    public getMessage() {
        return `Hello, my name is ${this.name} and I work in ${this.price}.`
    }
}                                                     

let lecctuce = new Vegetables("lecctuce", "$12.99");
console.log(lecctuce.getMessage());
console.log(lecctuce.name);

// 构造函数也能被 protected 修饰，这意味着这个类不能在包含它的类外被实例化，但是能被继承
class Fruite {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

class Apple extends Fruite {
    private price: number;
    constructor(name: string, price: number) {
        super(name);
        this.price = price;
    }

    public getPrice() {
        return `Hello, my name is ${this.name} and my price is ${this.price}.`
    }
}

let apple = new Apple('apple', 18);
let pineapple = new Fruite('pineapple');

// readonly 修饰符
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor(theName) {
        this.name = theName;
    }
}
let paul = new Octopus("God of predict");
paul.name = sam;

// 参数属性
// 定义一个只读属性并立刻在构造函数中将该属性赋值给它
class defineOctopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
// 参数属性通过在构造函数参数前面添加一个访问限定符来声明

// 存取器
// TS 支持通过 getters/setters 来截取对象成员的访问
let pwd = "secret pwd";
class CheckEmployee {
    private _fullName: string;
    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (pwd && pwd === "secret pwd") {
            this._fullName = newName;
        }
    }
}
// 存取器需要编译器在 ES5 以上版本，不支持降级到 ES3.
// 只带 get 不带 set 的存取器自动被推断为 readonly

// 静态属性
// 创建类的静态成员，这些属性存在于类本身上面而不是类的实例上。
class Grid {
    static origin = { x: 0, y: 0 };
    caculateDistanceFromOrigin(point: { x: number; y: number; }) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor(public scale: number) { }
}

// 抽象类
// 抽象类做为其他派生类的基类使用。它们一般不会直接被实例化。不同于接口，抽象类可以包含成员的实现细节
abstract class Dinosaur {
    abstract makeSound(): void;
    move(): void {
        console.log("bark!");
    }
}
// 抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。
// 抽象方法的语法与接口方法类似，两者都是定义方法签名但不包含方法体。
// 然而，抽象方法必须包含 abstract 关键字并且可以包含访问修饰符。
abstract class Department {
    constructor(public name: string) { }

    printName(): void {
        console.log(this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
    constructor() {
        super("Accounting"); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        super.printName();
    }

    generateReports(): void {
        console.log("Accounting reports...")
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误：不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误：方法在声明的抽象类中不存在

// 高级技巧
// 构造函数
// 类具有 实例部分 与 静态部分
class Greeter {
    greeting: string;
    constructor(public message: string) {}
    greet() {
        return `Hello${this.greeting}`;
    }
}

let greeter: Greeter;
greeter = new Greeter("world");

class Greeter2 {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter1: Greeter2;
greeter1 = new Greeter2();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter2 = Greeter2;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter2 = new greeterMaker();
console.log(greeter2.greet());

// 把类当接口用
class Point2 {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };