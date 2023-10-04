const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// gets the HTML
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write(index);

  response.end();
};

// gets the CSS
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(css);

  response.end();
};

module.exports = {
  getIndex,
  getCSS,
};
