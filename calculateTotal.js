/**
 * Calculates the total cost of items in a shopping cart including tax
 * @param {Array<{price: number, quantity: number, tax: number}>} items - Array of items with price, quantity, and tax
 * @returns {number} The total cost of all items including tax
 * @throws {TypeError} If items is not an array or contains invalid data
 * @throws {RangeError} If any numeric values are negative or NaN
 */
function calculateTotal(items) {
  // Validate that items parameter is provided
  if (items === null || items === undefined) {
    throw new TypeError('Items parameter is required and cannot be null or undefined');
  }
  
  // Validate that items is an array
  if (!Array.isArray(items)) {
    throw new TypeError('Items parameter must be an array');
  }
  
  // Handle empty array
  if (items.length === 0) {
    return 0;
  }
  
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Validate item is an object
    if (typeof item !== 'object' || item === null) {
      throw new TypeError(`Item at index ${i} must be an object`);
    }
    
    // Validate required properties exist
    if (!('price' in item)) {
      throw new TypeError(`Item at index ${i} is missing required property: price`);
    }
    if (!('quantity' in item)) {
      throw new TypeError(`Item at index ${i} is missing required property: quantity`);
    }
    if (!('tax' in item)) {
      throw new TypeError(`Item at index ${i} is missing required property: tax`);
    }
    
    // Validate properties are numbers
    if (typeof item.price !== 'number' || isNaN(item.price)) {
      throw new TypeError(`Item at index ${i} has invalid price: must be a number`);
    }
    if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
      throw new TypeError(`Item at index ${i} has invalid quantity: must be a number`);
    }
    if (typeof item.tax !== 'number' || isNaN(item.tax)) {
      throw new TypeError(`Item at index ${i} has invalid tax: must be a number`);
    }
    
    // Validate non-negative values
    if (item.price < 0) {
      throw new RangeError(`Item at index ${i} has negative price: ${item.price}`);
    }
    if (item.quantity < 0) {
      throw new RangeError(`Item at index ${i} has negative quantity: ${item.quantity}`);
    }
    if (item.tax < 0) {
      throw new RangeError(`Item at index ${i} has negative tax: ${item.tax}`);
    }
    
    // FIXED: Changed from addition (+) to multiplication (*)
    const subtotal = item.price * item.quantity;
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
console.log(`Total: $${total}`); // Should output: Total: $39.25

// Export for use in other modules
module.exports = calculateTotal;
