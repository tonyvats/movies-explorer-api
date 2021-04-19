const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const Forbidden = require('../errors/ForbiddenError');
const {
  notFoundMessage, badRequestMessage, forbiddenMessage,
} = require('../errors/ErrorMessages');
const movieSchema = require('../models/movie');

const getUsersMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then(() => res.status(200).send({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      next(err);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const id = req.params.movieId;

  movieSchema.findById(id)
    .select('+owner')
    .then((movie) => {
      console.log(movie);
      if (!movie) {
        throw new NotFoundError(notFoundMessage);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden(forbiddenMessage);
      }

      movieSchema.findByIdAndDelete(req.params.movieId)
        .then(deletedMovie => res.status(200).send(deletedMovie));
    })
    .catch(next);
};

module.exports = {
  getUsersMovies,
  postMovie,
  deleteMovieById,
};
