const http = require('http');
const url = require('url');

const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// This code taken directly from Parse Body demo in class (auth. Austin Willoughby)
const parseBody = (request, response, handler) => {
  // Array to store different components of the request
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};
// end borrowed code

// handles post requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addFilm') {
    parseBody(request, response, jsonHandler.addFilm);
  }
};

// handles get requests w query param support
const handleGet = (request, response, parsedUrl, params) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/getFilms') {
    jsonHandler.getFilms(request, response, 'get', params);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const handleHead = (request, response, parsedUrl, params) => {
  if (parsedUrl.pathname === '/getFilms') {
    jsonHandler.getFilms(request, response, 'head', params);
  } else {
    jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  // checks handlers
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl, params);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
