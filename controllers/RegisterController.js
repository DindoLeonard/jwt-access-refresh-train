const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password is required' });
  }

  // check for duplicates
  const duplicate = usersDB.users.find((user) => user.email === email);

  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // ecrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store new user
    const newUser = {
      id: usersDB.users[usersDB.users.length - 1].id + 1 || 1,
      email,
      password: hashedPassword,
      roles: { User: 2001 },
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );

    console.log(usersDB.users);

    res.status(201).json({ success: `New user ${email} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
