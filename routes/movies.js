import { Router } from 'express';
import { MovieControllers } from '../controllers/movies.js';

export const moviesRouter = Router();

moviesRouter.get('/', MovieControllers.getAll);

moviesRouter.get('/:id', MovieControllers.getByID);

moviesRouter.post('/', MovieControllers.create);

moviesRouter.delete('/:id', MovieControllers.delete);

moviesRouter.patch('/:id', MovieControllers.update);
