const http = require('http');
const url = require('url');

const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
// const jsonHandler = require('./jsResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handleGet = (request, response, parsedUrl) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  }
  // else {
  //     jsHandler.notFound(request, response);
  // }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // checks handlers
  // if (request.method === 'POST') {
  //     handlePost(request, response, parsedUrl);
  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  }
  // else if (request.method === 'HEAD') {
  //     handleHead(request, response, parsedUrl);
  // }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
