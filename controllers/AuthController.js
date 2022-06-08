const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECURE } = require('../constants/index');

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password)
    return res.status(400).json({ message: 'email and password is required' });

  // const foundUser = usersDB.users.find((userData) => userData.email === email);
  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // roles
    // boolean to filter nul val
    const roles = Object.values(foundUser.roles).filter(Boolean);

    // create JWTs
    const accessToken = jwt.sign(
      // {
      //   UserInfo: {
      //     id: foundUser.id,
      //     email: foundUser.email,
      //     roles,
      //   },
      // },
      {
        UserInfo: {
          _id: foundUser._id,
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s' }
    );

    const refreshToken = jwt.sign(
      { _id: foundUser._id, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '60s' }
    );

    // Saving refresh token with current user - dummy data
    // const otherUsers = usersDB.users.filter(
    //   (userData) => userData.email !== foundUser.email
    // );
    // const currentUser = { ...foundUser, refreshToken };
    // usersDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //   path.join(__dirname, '..', 'models', 'users.json'),
    //   JSON.stringify(usersDB.users)
    // );

    // Saving refresh token with current user - mongodb
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: JWT_SECURE,
      // secure: true, // set to true when you are in https
      maxAge: 24 * 60 * 60 * 1000, // set cookie for 1 hour
    });
    res.json({ accessToken }); // should store this in memory
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
