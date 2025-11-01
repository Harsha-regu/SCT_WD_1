const display = document.getElementById("display");
let justEvaluated = false;

function appendValue(value) {
  if (justEvaluated) {
    if (isDigitOrDot(value)) {
      display.value = value;
      justEvaluated = false;
      return;
    }
    justEvaluated = false;
  }

  if (display.value === "0" && value === "0") return;
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  justEvaluated = false;
}

function deleteChar() {
  if (justEvaluated) justEvaluated = false;
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    if (display.value.trim() === "") return;
    const sanitized = sanitizeExpression(display.value);
    const result = new Function("return " + sanitized)(); // safer than eval
    display.value = String(result);
    justEvaluated = true;
  } catch (e) {
    display.value = "Error";
    justEvaluated = false;
  }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key) || ["+", "-", "*", "/", "%", "."].includes(key)) {
    appendValue(key);
  } else if (key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteChar();
  } else if (key === "Escape") {
    clearDisplay();
  }
});

function isDigitOrDot(ch) {
  return /^[0-9.]$/.test(ch);
}

function sanitizeExpression(expr) {
  return expr.replace(/(?!^)[+\-*/%]{2,}/g, (match) => match.slice(-1));
}
