const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
  // on Client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = usersDB.users.find(
    (userData) => userData.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204); // Forbidden
  }

  // Delete the refreshToken in db
  const otherUsers = usersDB.users.filter(
    (userData) => userData.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users)
  );

  // delete cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true - only servers on https

  res.sendStatus(204);
};

module.exports = { handleLogout };
