// logger.js: Asynchronous background logger
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'product-actions.log');

function logProductAction(action, product) {
  // Async non-blocking logging
  const logLine = `${new Date().toISOString()} | ${action.toUpperCase()} | Product: ${JSON.stringify(product)}\n`;
  fs.promises.appendFile(logFile, logLine).catch(() => {/* ignore logging errors */});
}

module.exports = {
  logProductAction,
};
