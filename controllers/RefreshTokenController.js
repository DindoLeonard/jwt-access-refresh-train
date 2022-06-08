// const usersDB = {
//   users: require('../models/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  console.log('here');

  console.log('cookies', cookies);

  if (!cookies?.jwt) return res.sendStatus(401);

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;
  // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  // check if refreshToken is in db = dummy data
  // const foundUser = usersDB.users.find(
  //   (userData) => userData.refreshToken === refreshToken
  // );

  console.log('refresh', refreshToken);

  // check if refreshToken is in db = mongodb
  const foundUser = await User.findOne({ refreshToken }).exec();

  console.log(foundUser);

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      // {
      //   UserInfo: {
      //     id: decoded.id,
      //     email: decoded.email,
      //     roles,
      //   },
      // },
      {
        UserInfo: {
          _id: decoded._id,
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
