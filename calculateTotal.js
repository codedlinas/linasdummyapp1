/**
 * Calculates the total cost of items in a shopping cart
 * @param {Array<{price: number, quantity: number}>} items - Array of items with price and quantity
 * @returns {number} The total cost of all items
 */
function calculateTotal(items) {
  let total = 0;
  
  for (let item of items) {
    // Bug: Using + instead of * for quantity calculation
    total += item.price + item.quantity;
  }
  
  return total;
}

// Example usage
const shoppingCart = [
  { price: 10, quantity: 2 },
  { price: 5, quantity: 3 },
  { price: 20, quantity: 1 }
];

const total = calculateTotal(shoppingCart);
console.log(`Total: $${total}`); // Will give incorrect result due to bug

// Export for use in other modules
module.exports = calculateTotal;
