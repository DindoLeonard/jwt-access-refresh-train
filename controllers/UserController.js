const data = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const getUsers = (req, res) => {
  res.json(data.users);
};

const createNewUsers = (req, res) => {
  const newUser = {
    id: data.users[data.users.length - 1].id + 1 || 1,
    email: `user${data.users[data.users.length - 1].id + 1 || 1}@mail.com`,
    password: 'P4ssword',
  };

  if (!newUser.email || !newUser.password) {
    return res.status(400).json({ message: 'email and password required' });
  }

  data.setUsers([...data.users, newUser]);
  res.status(201).json(data.users);
};

const getUser = (req, res) => {
  const user = data.users.find(
    (userData) => userData.id === parseInt(req.params.id)
  );

  if (!user) {
    return res
      .status(400)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

module.exports = {
  getUsers,
  createNewUsers,
  getUser,
};
