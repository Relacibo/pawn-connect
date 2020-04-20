const fs = require('fs-extra');
const path = require('path');
let dest = './public';
const dependencies = {
  'react': './node_modules/react/cjs/react.production.min.js', 
  'react-dom': './node_modules/react-dom/cjs/react-dom.production.min.js'
};

for (key in dependencies) {
  const value = dependencies[key];
  fs.copySync(path.join(__dirname, value), path.join(__dirname, dest, `${key}.js`));
}