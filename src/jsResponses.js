// empty object to store films that users submit
const films = {};

const respondJSON = (request, response, status, object, body) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  if (body) {
    response.write(JSON.stringify(object));
  }
  response.end();
};

// head and get request handler
const getFilms = (request, response, type, params) => {
  const films2 = {}
  if (type === 'head') {
    return respondJSON(request, response, 200, 'null', false);
  }
  let responseJSON = {
    films,
  };
  // returns a separate array if user only wants entries with reviews (query param)
  if (params.sort === 'containsReview') {
    // make array from object
    const filmKeys = Object.keys(films);
    for (let i = 0; i < filmKeys.length; i++) {
      const entry = films[filmKeys[i]];
      // if a review exists, add it to the new array
      if (entry.review) {
        films2[entry.name] = films[entry.name];
      }
    }
    responseJSON = {
      films2,
    };
  }
  return respondJSON(request, response, 200, responseJSON, true);
};

// post request
const addFilm = (request, response, body) => {
  const responseJSON = {
    message: 'Please enter a film name, date, and rating.',
  };

  // bad request handler
  if (!body.name || !body.date || !body.rating) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON, true);
  }

  let responseCode = 204;

  // If the film isn't in the diary yet
  if (!films[body.name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    films[body.name] = {};
  }

  // add or update fields for this film
  films[body.name].name = body.name;
  films[body.name].date = body.date;
  films[body.name].rating = body.rating;
  films[body.name].review = body.review;
  films[body.name].poster = body.poster;

  // if a film was added for the first time
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON, true);
  }

  // if not
  return respondJSON(request, response, responseCode, responseJSON, false);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON, true);
};

module.exports = {
  getFilms,
  addFilm,
  notFound,
};
