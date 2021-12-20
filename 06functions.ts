// 函数
// 函数类型
// 函数可以给每个参数添加类型之后再为函数本身添加返回值类型。TS能够根据返回语句自动推断出返回值类型，因此通常可以省略。
// 书写完整函数类型
let myAdd: (x: number, y: number) => number = function(x: number, y: number): number { return x + y };
// 函数类型包含两部分:参数类型和返回值类型.参数列表中参数的名字只是为了增加可读性,在函数中不在乎参数名称是否正确
// 推断类型
let add = function(x: number, y: number): number { return x + y };
let minus: (baseValue: number, increment: number) => number = function(x, y)  { return x + y };

// 可选参数和默认参数
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

// 所有带默认值的参数都是可选的,在调用函数时可以省略,否则不能省略
// 与普通可选参数不同的时,带默认值的参数不需要放在必须参数的后面,在传参时显示地传入一个 undefined 即可

// 剩余参数
function build(firstName: string, ...resetOfName: string[]) {
    return firstName + " " + resetOfName.join(" ");
}

let buildFun: (fname: string, ...reset: string[]) => string = build;

// this 指向
// this.suits[pickedSuit]的类型依旧为any。 这是因为 this来自对象字面量里的函数表达式。 修改的方法是，提供一个显式的 this参数。 this参数是个假的参数，它出现在参数列表的最前面
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);