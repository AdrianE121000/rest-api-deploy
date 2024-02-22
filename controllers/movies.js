import { validateMovie, validatePartialMovie } from '../Schema/movies.js';
import { MovieModel } from '../models/movie.js';

export class MovieControllers {
  static async getAll(req, res) {
    const { genre } = req.query;

    const movies = await MovieModel.getAll({ genre });

    res.json(movies);
  }

  static async getByID(req, res) {
    const { id } = req.params;

    const movie = await MovieModel.getID({ id });

    if (movie) return res.json(movie);

    res.status(404).json({ message: 'Movie Not Found' });
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });

    res.status(201).json(newMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = await MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: 'Movie Not Found' });
    }

    return res.json({ message: 'Movie Deleted' });
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.success)
      return res.status(400).json({ error: JSON.parse(result.error.message) });

    const { id } = req.params;

    const updateMovie = await MovieModel.update({ id, input: result.data });

    return res.json(updateMovie);
  }
}
