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
  const remaining = displayText.slice(0, -1);

  clearDisplay();
  addToDisplay(remaining);

  if (state === "num1") {
    num1 = remaining;
    if (num1 === "") transitionToInitialState();
  } else if (state === "num2") {
    num2 = remaining;
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

  if (state === "num1") {
    num1 += digit;
  } else {
    num2 += digit;
  }

  if (digit === ".") document.querySelector(".dot-button").disabled = true;
}

function calculateAndDisplayResult() {
  let result = operate(num1, num2, operator);
  clearDisplay();
  addToDisplay(result);
  [num1, num2] = [result, ""];
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
      updateNumber(buttonText);
    }
  } else if (isDigit(buttonText) || buttonText === ".") {
    // In both num1 and num2 states, getting a new digit updates the number,
    // and doesn't lead to any state change.
    updateNumber(buttonText);
  } else if (buttonText === "=") {
    // Calculate if the second number is valid.
    if (state === "num2" && num2 != "") calculateAndDisplayResult();
  } else {
    // If no other branches were valid, this means a valid operator was pressed.
    if (state === "num2") calculateAndDisplayResult();

    transitionToNum2State(buttonText);
  }
}

// Three main states are possible: initial, num1, and num2
let state = "initial";
let [num1, num2, operator] = ["", "", ""];
const VALID_OPERATORS = ["+", "-", "*", "/", "%"];

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", execute));
