const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundMessage } = require('../errors/NotFoundError');

const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use(usersRouter, moviesRouter);
router.use(auth, () => {
  throw new NotFoundError(notFoundMessage);
});

module.exports = router;
