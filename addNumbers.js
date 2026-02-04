/**
 * Adds two numbers together
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 * @throws {TypeError} If inputs are not numbers
 */
function addNumbers(a, b) {
  // Validate that both inputs are numbers
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  
  // Check for NaN
  if (isNaN(a) || isNaN(b)) {
    throw new TypeError('Arguments cannot be NaN');
  }
  
  return a + b;
}

module.exports = addNumbers;
