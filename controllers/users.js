const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  notFoundMessage,
  badRequestMessage,
  conflictMessage,
  unauthorizedMessage,
} = require('../errors/ErrorMessages');

const createProfile = (req, res, next) => {
  const { name, email, password } = req.body;
  userSchema.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(conflictMessage);
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => userSchema.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => {
      res.send({ email: data.email, name: data.name });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new UnauthorizedError(unauthorizedMessage);
  }
  userSchema.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError(badRequestMessage);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequestError(badRequestMessage);
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getProfile = (req, res, next) => userSchema.findById(req.user._id)
  .catch(() => {
    throw new NotFoundError(notFoundMessage);
  })
  .then(user => res.send(user))
  .catch(next);

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError(badRequestMessage);
  }
  userSchema.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        throw new NotFoundError(notFoundMessage);
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(badRequestMessage);
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(badRequestMessage);
      }
      if (err.codeName === 'DuplicateKey') {
        throw new ConflictError(conflictMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  login,
  createProfile,
  getProfile,
  updateProfile,
};
