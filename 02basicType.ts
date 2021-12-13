// 基本类型
let isDone: boolean = false;
let list: number[] = [1, 2, 3];
let list2  : Array<number> = [1, 2, 3];
// Declare a tuple type
let x: [string, number];
// initialize it
x = ['hello', 10]; // 0k
// initialize it incorrectly
x = [10, 'hello']; // error

// enum Color {Red, Green, Blue}
// let c: Color = Color.Green;

// enum Color {Red = 1, Green, Blue}
// let c: Color = Color.Green;

enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // Green

// let notSure: any = 4;
// notSure = "maybe a string instaed";
// notSure = false; // okay, definitely a boolean

let notSure: any = 4;
notSure.ifIteExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

let listAny: any[] = [1, true, "free"];
listAny[1] = 100;

function warnUser(): void {
    console.log("This is my warning message");
}

// 声明 void 类型的变量，只能赋值 undefined 和 null
let unusable: void = undefined;

// TS 中 null 和 undefined 是所有类型的子类型
// 如果指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。
// 如果想在某处传入一个 string 或 null 或 undefined，可以使用联合类型 string | null | undefined

// Never
// never 类型表示的是那些永不存在值的类型。例如，never 类型是那些总是会抛出异常或者根本就不会有返回值的函数表达式或箭头表达式的返回值类型；变量也可能是 nver 类型，当他们被永不为真的类型保护所约束时
// never 类型时任何类型的子类型，也可以赋值给任何类型；但是，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。即使 any 也不可以赋值给 never。
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为 never
function fail() {
    return error("Something failed");
}

// 返回 never 的函数必须存在无法到达的终点
function infiniteLoop(): never {
    while (true) {

    }
}

// Object
// object 表示非原始类型，也就是除 number, string, boolean, symbol, null 和 undefined 之外的类型
// 使用 object 类型，就可以更好的表示像 Object.create 这样的 API。
declare function create(o: object | null): void;
create({ prop: 0 }); // OK
create(null); // OK
create(undefined); // OK, null 和 undefined 可以相互转换

create(42); // Error
create("string"); // Error
create(false); // Error

// 类型断言
// 有时候会比 TS 更了解某个值的详细信息。通常发生在清楚地知道一个实体具有比它现有类型更确切的类型
// 通过 类型断言 可以告诉告诉编译器。类型断言好比其他语言的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。
// 类型断言有两种形式。其一是 "尖括号" 语法:
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
// 另一个为 as 语法:
let someValue2: any = "this is a string two";
let strLength2: number = (someValue2 as string).length;