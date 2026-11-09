const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const simple = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const enhance = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user || user.role !== 'superadmin') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Staff access: any logged-in user whose role is cashier/admin/superadmin.
// Used for box-office (POS) endpoints so counter staff — not just the owner —
// can process walk-in sales, while regular customers (role 'guest') cannot.
const staff = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user || !['cashier', 'admin', 'superadmin'].includes(user.role)) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Attaches req.user when a valid token is present, but never rejects the
// request when it is missing/invalid. For routes where login is optional.
const optional = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (header) {
      const token = header.replace('Bearer ', '');
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findOne({
        _id: decoded._id,
        'tokens.token': token,
      });
      if (user) {
        req.token = token;
        req.user = user;
      }
    }
  } catch (e) {
    // ignore — proceed as a guest
  }
  next();
};

module.exports = { simple, enhance, staff, optional };
