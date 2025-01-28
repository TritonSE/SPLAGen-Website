import express from 'express';
import * as UserController from '../controllers/user';
import * as UserValidator from '../validators/user';

const router = express.Router();

/**
 * User directory routes
 * POST /api/users - Add user to directory
 * DELETE /api/users/:id - Remove user from directory
 * GET /api/users - Get all users in directory
 * GET /api/users/:id - Get specific user from directory
 */

router.post('/', UserValidator.createUser, UserController.createUser);
router.delete('/:id', UserValidator.deleteUser, UserController.deleteUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserValidator.getUser, UserController.getUser);

export default router;