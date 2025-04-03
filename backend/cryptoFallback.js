// Simplified and more reliable implementation
const setupBcryptFallback = () => {
    try {
      const bcrypt = require('bcryptjs');
      
      // Apply a direct simple fallback using JavaScript's Math.random
      if (typeof bcrypt.setRandomFallback === 'function') {
        bcrypt.setRandomFallback((len) => {
          return Array.from({ length: len }, () => Math.floor(Math.random() * 256));
        });
        console.log('bcryptjs fallback set successfully');
      }
      
      // Test if bcrypt works
      const testHash = bcrypt.hashSync('test', 3);
      console.log('bcryptjs test successful');
    } catch (error) {
      console.error('bcryptjs setup error:', error.message);
    }
  };
  
  module.exports = setupBcryptFallback;