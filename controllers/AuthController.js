const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config(); // initialize dotenv config
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password)
    return res.status(400).json({ message: 'email and password is required' });

  const foundUser = usersDB.users.find((userData) => userData.email === email);

  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // roles
    const roles = Object.values(foundUser.roles);

    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s' }
    );

    const refreshToken = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '60s' }
    );

    // Saving refresh token with current user
    const otherUsers = usersDB.users.filter(
      (userData) => userData.email !== foundUser.email
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // set to true when you are in https
      maxAge: 24 * 60 * 60 * 1000, // set cookie for 1 hour
    });
    res.json({ accessToken }); // should store this in memory
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
