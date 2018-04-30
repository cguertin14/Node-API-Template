import UserController from './../controllers/userController';
import { bearer } from './../middleware/authenticate';
import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
    new UserController(req, res).signUp();
});

router.get('/me', bearer, (req, res) => {
    new UserController(req, res).me();
});

router.post('/login', (req, res) => {
    new UserController(req, res).logIn();
});

router.delete('/me/token', bearer, (req, res) => {
    new UserController(req, res).logOut();
});

export default router;