const express = require('express');
const UserController = require('../controllers/UserController');
const RegisterController = require('../controllers/RegisterController');
const AuthController = require('../controllers/AuthController');
const RefreshTokenController = require('../controllers/RefreshTokenController');
const LogoutController = require('../controllers/LogoutController');
const verifyJWT = require('../middleware/verifyJWT');

const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

const router = express.Router();

router.route('/register').post(RegisterController.handleNewUser);

router.route('/auth').post(AuthController.handleLogin);

router.route('/refresh').get(RefreshTokenController.handleRefreshToken);

router.route('/logout').get(LogoutController.handleLogout);

// protected routes
router
  .use(verifyJWT) // add verify jwt
  .route('/user')
  .get(verifyRoles(ROLES_LIST.User), UserController.getAllUsers);
// .post(
//   verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   UserController.createNewUsers
// );

router.route('/user/:id').get(UserController.getUser);

module.exports = router;
