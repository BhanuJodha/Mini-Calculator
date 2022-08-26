"use strict";

const user = {
    history: [],
    stack: [],
    pointer: 0,
    pastEqual: 0
};

let postDisplay = "";
let display = 0;

const refreshDisplay = () => {
    document.getElementsByClassName("main")[0].innerHTML = display;
    document.getElementsByClassName("post")[0].innerHTML = postDisplay;
}

const setOperand = operand => {
    // For not to append
    if (!user.stack[user.pointer] || user.stack[user.pointer] === "0") {
        user.stack[user.pointer] = operand;
        display = operand;
    }
    else {
        user.stack[user.pointer] += operand;
        display += operand;
    }
    refreshDisplay();
};

const equal = () => {
    let string;
    // For blank input or single input
    if (user.stack.length <= 1) {
        string = user.stack[0] ? user.stack[0] : 0;
    }
    // For ittrative input
    else if (user.stack.length == 2) {
        string = user.stack[0] + " " + user.stack[1] + " " + user.pastEqual;
    }
    else {
        string = user.stack[0] + " " + user.stack[1] + " " + user.stack[2];
        user.pastEqual = user.stack[2];
    }

    user.history.push(eval(string).toString());
    user.stack = [user.history[user.history.length - 1], user.stack[1]];

    display = user.stack[0];
    postDisplay = string + " =";
    user.pointer = 0;
    refreshDisplay();
}

const setOperator = operator => {
    if (user.stack[0] == undefined) {
        console.log("throw error : empty stack");
        return "throw error : empty stack";
    }

    // Update operator
    if (user.stack.length <= 2) {
        display = display ? display : 0;
    }
    // For operator calculation
    else {
        let string;
        string = user.stack[0] + " " + user.stack[1] + " " + user.stack[2];
        user.history.push(eval(string).toString());

        user.stack = [user.history[user.history.length - 1]];
        display = user.stack[0];
    }


    user.stack[1] = operator;
    postDisplay = user.stack[0] + " " + operator;
    user.pointer = 2;
    refreshDisplay();
};

const backspace = () => {
    let value = user.stack;
    if (display.length <= 1 || display.length == undefined) {
        value[user.pointer] = 0;
        display = 0;
    }
    else {
        value[user.pointer] = value[user.pointer].slice(0, value[user.pointer].length - 1);
        display = display.slice(0, display.length - 1);
    }
    refreshDisplay();
}

const clearEntity = () => {
    user.stack = [];
    user.pointer = 0;
    user.pastEqual = 0;
    display = 0;
    postDisplay = "";
    refreshDisplay();
}

const clear = () => {
    user.history = [];
    clearEntity();
}

const convert = () => {
    if (user.stack[user.pointer] == undefined) {
        console.log("zero error");
        return 0;
    }
    else if (user.stack[user.pointer][0] == '-') {
        user.stack[user.pointer] = user.stack[user.pointer].slice(1, user.stack[user.pointer].length);
    }
    else {
        user.stack[user.pointer] = '-' + user.stack[user.pointer];
    }
    display = user.stack[user.pointer];
    refreshDisplay();
    return 1;
}

const modulo = () => {
    if (user.stack.length <= 1) {
        clearEntity();
        postDisplay = 0;
    }
    else {
        // Value is for Ittrative percentage
        let value = user.stack[2] ? user.stack[2] : user.stack[0];
        user.stack[2] = user.stack[0] / 100 * value;
        postDisplay = user.stack[0] + " " + user.stack[1] + " " + user.stack[2];
        display = user.stack[2];
    }
    refreshDisplay();
}

const pow = (num = 2) => {
    if (user.stack.length == 0) {
        postDisplay = 0;
    }
    else {
        // -2 Stands for Sqrt
        user.stack[user.pointer] = num == -2 ? Math.sqrt(user.stack[user.pointer]) : Math.pow(user.stack[user.pointer], num);

        display = user.stack[user.pointer];
        postDisplay = user.pointer == 0 ? display : user.stack[0] + " " + user.stack[1] + " " + display;
    }
    refreshDisplay();
}

const checkVal = function (event) {
    let innerText;
    if (event.type == "keydown") {
        innerText = event.key;
    }
    else {
        innerText = this.innerText;
    }
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (innerText in arr || innerText == ".") {
        setOperand(innerText);
    }
    else {
        switch (innerText) {
            case "=":
            case "Enter":
                equal();
                break;
            case "backspace":
            case "Backspace":
            case "Delete":
                backspace();
                break;
            case "±":
                convert();
                break;
            case "CE":
                clearEntity();
                break;
            case "C":
            case "Escape":
                clear();
                break;
            case "remove":
            case "-":
                setOperator("-");
                break;
            case "add":
            case "+":
                setOperator("+");
                break;
            case "×":
            case "*":
                setOperator("*");
                break;
            case "÷":
            case "/":
                setOperator("/");
                break;
            case "percent":
                modulo();
                break;
            case "㎡":
                pow();
                break;
            case "m³":
                pow(3);
                break;
            case "√":
                pow(-2);
                break;
            default:
                break;
        }
    }
};


// Adding event listener to all buttons
for (let element of document.getElementsByClassName("buttons")) {
    element.addEventListener("click", checkVal);
};

// Adding event listener for keybord
document.addEventListener("keydown", checkVal)
