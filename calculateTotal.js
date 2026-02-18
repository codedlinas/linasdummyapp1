/**
 * Calculates the total cost of items in a shopping cart including tax
 * @param {Array<{price: number, quantity: number, tax: number}>} items - Array of items with price, quantity, and tax
 * @returns {number} The total cost of all items including tax
 */
function calculateTotal(items) {
  let total = 0;
  
  for (let item of items) {
    // Bug: Using + instead of * for quantity calculation
    const subtotal = item.price + item.quantity;
    total += subtotal + item.tax;
  }
  
  return total;
}

// Example usage
const shoppingCart = [
  { price: 10, quantity: 2, tax: 1.5 },
  { price: 5, quantity: 3, tax: 0.75 },
  { price: 20, quantity: 1, tax: 2.0 }
];

const total = calculateTotal(shoppingCart);
console.log(`Total: $${total}`); // Will give incorrect result due to bug

// Export for use in other modules
module.exports = calculateTotal;
