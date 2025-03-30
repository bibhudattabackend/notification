const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).send('Access Denied. Please login.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid Token');
  }
};