const moviesRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { getUsersMovies, postMovie, deleteMovieById } = require('../controllers/movies');
const { postMovieValidation, deleteMovieByIdValidation } = require('../middlewares/validation');

moviesRouter.get('/movies', auth, getUsersMovies);
moviesRouter.post('/movies', postMovieValidation, auth, postMovie);
moviesRouter.delete('/movies/:movieId', deleteMovieByIdValidation, auth, deleteMovieById);

module.exports = moviesRouter;
