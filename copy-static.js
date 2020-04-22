const fs = require('fs-extra');
const path = require('path');
const dependencies = {
  'react': './node_modules/react/umd/react.production.min.js',
  'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js',
  'redux': './node_modules/redux/dist/redux.min.js',
  'peerjs': './node_modules/peerjs/dist/peerjs.min.js'
};

const dependenciesDev = {
  'react': './node_modules/react/umd/react.development.js',
  'react-dom': './node_modules/react-dom/umd/react-dom.development.js',
  'redux': './node_modules/redux/dist/redux.js',
  'peerjs': './node_modules/peerjs/dist/peerjs.js'
}

const sourceMaps = {
  'peerjs': './node_modules/peerjs/dist/peerjs.js.map'
}

function copyAll(obj, extention, dest) {
  for (key in obj) {
    const value = obj[key];
    fs.copySync(path.join(__dirname, value), path.join(__dirname, dest, `${key}${extention}`));
  }
}

if (process.env.NODE_ENV === 'development') {
  copyAll(dependenciesDev, '.js', './dev');
  copyAll(sourceMaps, '.js.map', './dev');
} else {
  copyAll(dependencies, '.js', './public');
}
