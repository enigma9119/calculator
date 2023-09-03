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

function populateDisplay(text) {
  const display = document.querySelector(".display");
  display.textContent += text;
}

function clearDisplay() {
  const display = document.querySelector(".display");
  display.textContent = "";
}

function deleteFromDisplay() {
  const displayText = document.querySelector(".display").textContent;

  clearDisplay();
  populateDisplay(displayText.slice(0, -1));

  if (state === "num1") {
    num1 = Math.round(num1 / 10);
  } else {
    num2 = Math.round(num2 / 10);
  }

  if (Number.isNaN(+displayText[-1])) {
    state = "num1";
  }
}

function updateNumber(digit, state) {
  populateDisplay(digit);

  if (state === "num1") {
    num1 = num1 * 10 + digit;
  } else {
    num2 = num2 * 10 + digit;
  }
}

function execute(e) {
  const classListArray = Array.from(e.target.classList);
  if (
    classListArray.includes("delete") ||
    classListArray.includes("fa-delete-left")
  ) {
    deleteFromDisplay();
    return;
  }

  let buttonText = e.target.textContent;
  if (classListArray.includes("divide")) buttonText = "/";

  if (buttonText === "AC") {
    clearDisplay();
    [num1, num2, operator] = [0, 0, ""];
    state = "empty";
  } else if (state == "empty") {
    if (+buttonText >= 0 && +buttonText <= 9) {
      state = "num1";
      clearDisplay();
      updateNumber(+buttonText, state);
    }
  } else if (+buttonText >= 0 && +buttonText <= 9) {
    updateNumber(+buttonText, state);
  } else if (state === "num1") {
    operator = buttonText;
    populateDisplay(operator);
    state = "num2";
  } else if (num2 && state === "num2") {
    let result = operate(num1, num2, operator);
    [num1, num2] = [result, 0];

    if (buttonText != "=") {
      operator = buttonText;
      result += operator;
    } else {
      operator = "";
      state = "empty";
      num1 = 0;
    }

    clearDisplay();
    populateDisplay(result);
  }
}

let [num1, num2, operator] = [0, 0, ""];
let state = "empty";

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", execute));
