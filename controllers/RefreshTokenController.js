const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require('jsonwebtoken');
require('dotenv').config(); // initialize dotenv config

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);

  if (!cookies?.jwt) return res.sendStatus(401);

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (userData) => userData.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  // evaluate password

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: decoded.id,
          email: decoded.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
