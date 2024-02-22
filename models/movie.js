import { readJSON } from '../utils.js';
import { randomUUID } from 'crypto';

// como leer un json en ESModules recomendado por ahora
const movies = readJSON('./movies.json');

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  };

  static async getID({ id }) {
    const movie = movies.find((movie) => movie.id === id);

    return movie;
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    };

    movies.push(newMovie);

    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);

    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) return false;

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
  }
}
