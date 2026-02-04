/**
 * Adds two numbers together and returns the sum
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 */
function addNumbers(a, b) {
  return a + b;
}

// Example usage
const result = addNumbers(5, 3);
console.log(result); // Output: 8

// Export for use in other modules (if needed)
module.exports = addNumbers;
