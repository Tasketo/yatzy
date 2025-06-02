// e2e/collect-coverage.cjs
module.exports = async () => {
  const fs = require('fs');
  const path = require('path');
  if (global.__coverage__) {
    const coverageDir = path.join(__dirname, '../coverage');
    if (!fs.existsSync(coverageDir)) fs.mkdirSync(coverageDir);
    fs.writeFileSync(path.join(coverageDir, 'coverage-final.json'), JSON.stringify(global.__coverage__));
  }
};
