const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, findUserById } = require('../queries/users');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const existing = await findUserByEmail(email.toLowerCase());
    if (existing.rows.length) {
      console.log(`🚫 signup blocked: ${email} already exists — someone's eager`);
      return res.status(409).json({ message: 'Email already in use' });
    }

    // bcrypt at 12 rounds — slow on purpose, that's the whole point
    const hashed = await bcrypt.hash(password, 12);
    const result = await createUser(name?.trim() || null, email.toLowerCase(), hashed);
    const user = result.rows[0];

    console.log(`🎉 new user signed up: ${email} (id: ${user.id})`);
    res.status(201).json({ token: signToken(user.id), user });
  } catch (err) {
    console.error('💥 signup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const result = await findUserByEmail(email.toLowerCase());
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`🔐 failed login attempt for: ${email} — wrong password or doesn't exist`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ ${email} logged in successfully`);
    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(user.id), user: safeUser });
  } catch (err) {
    console.error('💥 login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const result = await findUserById(req.user.id);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('💥 getMe error — token was valid but user vanished somehow:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
