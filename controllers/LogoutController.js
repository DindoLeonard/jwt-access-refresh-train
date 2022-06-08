// const usersDB = {
//   users: require('../models/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const User = require('../models/User');
const { JWT_SECURE } = require('../constants/index');

// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogout = async (req, res) => {
  // on Client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?  - dummy data
  // const foundUser = usersDB.users.find(
  //   (userData) => userData.refreshToken === refreshToken
  // );

  // Is refreshToken in db?  - mongodb
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      // secure: false
      secure: JWT_SECURE,
    });
    return res.sendStatus(204); // Forbidden
  }

  // Delete the refreshToken in db - dummy data
  // const otherUsers = usersDB.users.filter(
  //   (userData) => userData.refreshToken !== foundUser.refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: '' };
  // usersDB.setUsers([...otherUsers, currentUser]);
  // await fsPromises.writeFile(
  //   path.join(__dirname, '..', 'models', 'users.json'),
  //   JSON.stringify(usersDB.users)
  // );

  // Delete the refreshToken in db - mongodb
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log('res', result);

  // delete cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    // secure: false
    secure: JWT_SECURE,
  }); // secure: true - only servers on https

  res.sendStatus(204);
};

module.exports = { handleLogout };
