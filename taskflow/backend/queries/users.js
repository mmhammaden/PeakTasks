const pool = require('../config/db');

const findUserByEmail = (email) =>
  pool.query('SELECT * FROM users WHERE email = $1', [email]);

const createUser = (name, email, hashedPassword) =>
  pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [name, email, hashedPassword]
  );

const findUserById = (id) =>
  pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);

module.exports = { findUserByEmail, createUser, findUserById };
