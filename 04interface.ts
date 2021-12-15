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
// 当使用可选属性时，TS 会进行额外属性检查，即超出的
