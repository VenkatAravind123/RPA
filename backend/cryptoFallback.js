// This file sets up a fallback for bcryptjs to work in Vercel's environment

// Custom random bytes generator
const getRandomValues = (length) => {
    const values = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      values[i] = Math.floor(Math.random() * 256);
    }
    return values;
  };
  
  // Setup bcryptjs with fallback
  // Alternative implementation for cryptoFallback.js
const setupBcryptFallback = () => {
    try {
      const bcrypt = require('bcryptjs');
      
      // Log bcryptjs version to help diagnose issues
      const version = require('bcryptjs/package.json').version;
      console.log(`Using bcryptjs version: ${version}`);
      
      if (typeof bcrypt.setRandomFallback === 'function') {
        bcrypt.setRandomFallback((len) => {
          const arr = [];
          for (let i = 0; i < len; i++) {
            arr.push(Math.floor(Math.random() * 256));
          }
          return arr;
        });
        console.log('bcryptjs random fallback set successfully');
      } else {
        console.log('bcryptjs.setRandomFallback function not available');
      }
    } catch (error) {
      console.error('Error setting up bcryptjs fallback:', error.message);
    }
  };
  module.exports = setupBcryptFallback;