// const data = {
//   users: require('../models/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const getUsers = (req, res) => {
//   res.json(data.users);
// };

// const createNewUsers = (req, res) => {
//   const newUser = {
//     id: data.users[data.users.length - 1].id + 1 || 1,
//     email: `user${data.users[data.users.length - 1].id + 1 || 1}@mail.com`,
//     password: 'P4ssword',
//   };

//   if (!newUser.email || !newUser.password) {
//     return res.status(400).json({ message: 'email and password required' });
//   }

//   data.setUsers([...data.users, newUser]);
//   res.status(201).json(data.users);
// };

// const getUser = (req, res) => {
//   const user = data.users.find(
//     (userData) => userData.id === parseInt(req.params.id)
//   );

//   if (!user) {
//     return res
//       .status(400)
//       .json({ message: `User ID ${req.params.id} not found` });
//   }
//   res.json(user);
// };

const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: 'No users found' });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ message: 'User ID required' });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await User.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: 'User ID required' });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.json(user);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
};
