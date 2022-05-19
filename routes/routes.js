const express = require('express');
const UserController = require('../controllers/UserController');
const RegisterController = require('../controllers/RegisterController');
const AuthController = require('../controllers/AuthController');
const RefreshTokenController = require('../controllers/RefreshTokenController');
const LogoutController = require('../controllers/LogoutController');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();

router.route('/register').post(RegisterController.handleNewUser);

router.route('/auth').post(AuthController.handleLogin);

router.route('/refresh').get(RefreshTokenController.handleRefreshToken);

router.route('/logout').get(LogoutController.handleLogout);

// protected routes
router
  .use(verifyJWT) // add verify jwt
  .route('/user')
  .get(UserController.getUsers)
  .post(UserController.createNewUsers);

router.route('/user/:id').get(UserController.getUser);

module.exports = router;
