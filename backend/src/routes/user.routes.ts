import { UserRepository } from './../app/user/UserRepository';
import { UserController } from '../app/user/UserController';
import { UserService } from '../app/user/UserService';

import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const routes = Router();

routes.post('/register', (req, res) => {
  return userController.store(req, res);
});

routes.post('/login', (req, res) => {
  return userController.login(req, res);
});

routes.put('/users/:userId', ensureAuthenticated, (req, res) => {
  return userController.update(req, res);
});

routes.delete('/users/:userId', ensureAuthenticated, (req, res) => {
  return userController.destroy(req, res);
});

routes.patch(
  '/users/:userId/updatePassword',
  ensureAuthenticated,
  (req, res) => {
    return userController.changePassword(req, res);
  }
);

export { routes };
