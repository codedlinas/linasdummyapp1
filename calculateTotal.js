/**
 * Calculates the total cost of items including tax
 * @param {Array} items - Array of item objects with price, quantity, and tax properties
 * @returns {number} The total cost including tax
 * @throws {TypeError} If items is not an array or contains invalid data
 */
function calculateTotal(items) {
  // Validate that items is an array
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  
  let total = 0;
  
  for (const item of items) {
    // Validate that item is an object
    if (typeof item !== 'object' || item === null) {
      throw new TypeError('Each item must be an object');
    }
    
    // Validate that required properties exist and are numbers
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number' || typeof item.tax !== 'number') {
      throw new TypeError('Each item must have numeric price, quantity, and tax properties');
    }
    
    // Check for NaN values
    if (isNaN(item.price) || isNaN(item.quantity) || isNaN(item.tax)) {
      throw new TypeError('Price, quantity, and tax cannot be NaN');
    }
    
    // FIX: Changed from addition to multiplication (price * quantity)
    const subtotal = item.price * item.quantity;
    const taxAmount = subtotal * item.tax;
    total += subtotal + taxAmount;
  }
  
  return total;
}

module.exports = calculateTotal;
