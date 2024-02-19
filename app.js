const express = require('express');
const movies = require('./movies.json');
const crypto = require('node:crypto');
const cors = require('cors');
const { validateMovie, validatePartialMovie } = require('./Schema/movies');
// https://rest-api-deploy-dev-sjpg.3.us-1.fl0.io/movies

const app = express();
app.disable('x-powered-by');
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'https://movies.com',
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

// * De forma nativa
// const ACCEPTED_ORIGINS = [
//   'http://localhost:8080',
//   'http://localhost:1234',
//   'https://movies.com',
// ];

app.get('/movies', (req, res) => {
  // * De forma nativa
  // const origin = req.header('origin');

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }

  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );

    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);

  res.status(404).json({ message: 'Movie Not Found' });
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  // Esto no seria REST, porque estoy guardando el estado de la aplicacion en memoria
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.delete('/movies/:id', (req, res) => {
  // * De forma nativa
  // const origin = req.header('origin');

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie Not Found' });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: 'Movie Deleted' });
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success)
    return res.status(400).json({ error: JSON.parse(result.error.message) });

  const { id } = req.params;
  const movieIndex = movies.findIndex((index) => index.id === id);

  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie Not Found' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

// * De forma nativa
// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin');

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   }

//   res.send(200);
// });

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
