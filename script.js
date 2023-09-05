function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function modulo(num1, num2) {
  return num1 % num2;
}

function round(num, precision) {
  let multiplier = 10 ** precision;
  return Math.round(num * multiplier) / multiplier;
}

function operate(num1, num2, operator) {
  let result;
  [num1, num2] = [Number(num1), Number(num2)];

  switch (operator) {
    case "+":
      result = add(num1, num2);
      break;
    case "-":
      result = subtract(num1, num2);
      break;
    case "x":
      result = multiply(num1, num2);
      break;
    case "/":
      result = divide(num1, num2);
      break;
    case "%":
      result = modulo(num1, num2);
      break;
  }

  return round(result, 2);
}

function addToDisplay(text) {
  const display = document.querySelector(".display");
  display.textContent += text;
}

function clearDisplay() {
  const display = document.querySelector(".display");
  display.textContent = "";
}

function deleteFromDisplay() {
  const displayText = document.querySelector(".display").textContent;
  charToDelete = displayText.slice(-1);

  clearDisplay();
  addToDisplay(displayText.slice(0, -1));

  if (state === "num1") {
    num1 = Math.floor(num1 / 10);
    if (!num1) transitionToInitialState();
  } else if (state === "num2") {
    num2 = Math.floor(num2 / 10);
    if (VALID_OPERATORS.includes(charToDelete)) transitionToNum1State();
  }
}

function transitionToInitialState() {
  state = "initial";
  [num1, num2, operator] = [null, null, null];
}

function transitionToNum1State() {
  state = "num1";
  [num2, operator] = [null, null];
}

function transitionToNum2State(pressedButton) {
  state = "num2";
  operator = pressedButton;
  addToDisplay(operator);
}

function isDigit(text) {
  return +text >= 0 && +text <= 9;
}

function updateNumber(digit) {
  addToDisplay(digit);

  if (state === "num1") {
    num1 += digit;
  } else {
    // QUESTION: Why is this resulting in string "null<digit>"? num1 doesn't seem to do that.
    if (num2 === null) num2 = "";
    num2 += digit;
  }
}

function execute(e) {
  const classListArray = Array.from(e.target.classList);
  // QUESTION: Why is it that sometimes the outer class listener is triggered, and sometimes the inner class?
  if (
    classListArray.includes("delete") ||
    classListArray.includes("fa-delete-left")
  ) {
    deleteFromDisplay();
    return;
  }

  let buttonText = e.target.textContent;
  if (
    classListArray.includes("divide") ||
    classListArray.includes("fa-divide")
  ) {
    buttonText = "/";
  }

  if (buttonText === "AC") {
    clearDisplay();
    transitionToInitialState();
  } else if (state == "initial") {
    // The only way to transition out of the initial state is for the user
    // to input a valid digit.
    if (isDigit(buttonText)) {
      transitionToNum1State();
      updateNumber(+buttonText);
    }
  } else if (isDigit(buttonText) || buttonText === ".") {
    // In both num1 and num2 states, getting a new digit updates the number,
    // and doesn't lead to any state change.
    updateNumber(buttonText);
  } else if (buttonText === "=") {
    if (state === "num1") return;

    if (state === "num2" && num2 != null) {
      let result = operate(num1, num2, operator);
      clearDisplay();
      addToDisplay(result);
      transitionToNum1State();
      num1 = result;
    }
  } else {
    // If no other branches were valid, this means a valid operator was pressed.
    if (state === "num1") {
      transitionToNum2State(buttonText);
    } else if (state === "num2") {
      let result = operate(num1, num2, operator);
      clearDisplay();
      addToDisplay(result);
      [num1, num2] = [result, null];
    }
  }
}

// Three main states are possible: initial, num1, and num2
let state = "initial";
let [num1, num2, operator] = [null, null, null];
const VALID_OPERATORS = ["+", "-", "*", "/", "%"];

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", execute));
