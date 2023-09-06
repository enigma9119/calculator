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
  const charToDelete = displayText.slice(-1);

  clearDisplay();
  addToDisplay(displayText.slice(0, -1));

  if (state === "num1") {
    num1 = num1.slice(0, -1);
    if (num1 === "") transitionToInitialState();
  } else if (state === "num2") {
    num2 = num2.slice(0, -1);
    if (VALID_OPERATORS.includes(charToDelete)) transitionToNum1State();
  }

  if (charToDelete === ".") {
    document.querySelector(".dot-button").disabled = false;
  }
}

function transitionToInitialState() {
  state = "initial";
  [num1, num2, operator] = ["", "", ""];
  document.querySelector(".dot-button").disabled = false;
}

function transitionToNum1State() {
  state = "num1";
  [num2, operator] = ["", ""];

  if (num1.includes(".")) document.querySelector(".dot-button").disabled = true;
}

function transitionToNum2State(pressedButton) {
  state = "num2";
  operator = pressedButton;
  addToDisplay(operator);
  document.querySelector(".dot-button").disabled = false;
}

function isDigit(text) {
  return +text >= 0 && +text <= 9;
}

function updateNumber(digit) {
  addToDisplay(digit);

  if (state === "num1" || state === "initial") {
    num1 += digit;
  } else {
    num2 += digit;
  }

  if (digit === ".") document.querySelector(".dot-button").disabled = true;
}

function calculateAndDisplayResult() {
  if (num2 != "") {
    let result = operate(num1, num2, operator);
    clearDisplay();
    addToDisplay(result);
    [num1, num2] = [String(result), ""];
  }
}

function execute(text) {
  if (text === "Backspace") {
    deleteFromDisplay();
  } else if (text === "AC") {
    clearDisplay();
    transitionToInitialState();
  } else if (state == "initial") {
    // The only way to transition out of the initial state is for the user
    // to input a valid digit.
    if (isDigit(text)) {
      transitionToNum1State();
      updateNumber(text);
    } else if ((num1 === "" && text === "-") || text === ".") {
      updateNumber(text);
    }
  } else if (isDigit(text) || text === ".") {
    // If a digit is selected after pressing 'equal to' button, reset everything
    // and transition to num1 state.
    if (operator === "=") {
      num1 = "";
      clearDisplay();
      transitionToNum1State();
    }

    // In both num1 and num2 states, getting a new digit updates the number.
    updateNumber(text);
  } else {
    const displayText = document.querySelector(".display").textContent;
    const lastChar = displayText.slice(-1);

    if (!VALID_OPERATORS.includes(lastChar)) {
      if (text === "=") {
        const setEqualOperator = num2 !== "";
        calculateAndDisplayResult();
        transitionToNum1State();

        if (setEqualOperator) operator = "=";
      } else {
        // If no other branches were valid, this means an operator was pressed.
        calculateAndDisplayResult();
        transitionToNum2State(text);
      }
    }
  }
}

// Three main states are possible: initial, num1, and num2
let state = "initial";
let [num1, num2, operator] = ["", "", ""];
const VALID_OPERATORS = ["+", "-", "x", "/", "%"];

// Add mouse support
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", executeMouseEvent));

function executeMouseEvent(e) {
  let dataKeyAttribute = e.currentTarget.getAttribute("data-key");

  if (dataKeyAttribute === "c") dataKeyAttribute = "AC";
  if (dataKeyAttribute === "*") dataKeyAttribute = "x";

  execute(dataKeyAttribute);
}

// Add keyboard support
window.addEventListener("keydown", executeKeyboardEvent);

function executeKeyboardEvent(e) {
  let keyText = e.key;
  if (keyText === "Enter") keyText = "=";

  const key = document.querySelector(`button[data-key="${keyText}"]`);

  if (key) {
    if (e.key === "c") keyText = "AC";
    if (e.key === "*") keyText = "x";

    execute(keyText);
  }
}
