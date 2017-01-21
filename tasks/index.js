
const fs = require('fs');
const path = require('path').join;

module.exports = () => {
  const tasks = {};
  fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js')
    .forEach((file) => {
      const task = file.split('.').slice(0, -1).join('.');
      tasks[task] = require(path(__dirname, file)); // eslint-disable-line
    });
  return tasks;
};
