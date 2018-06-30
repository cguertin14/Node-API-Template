import UserController from './../controllers/userController';
import { bearer, login } from './../middlewares/authenticate';
import express from 'express';
const router = express.Router();

router.post('/login', login);

router.post('/', async (req, res) => {
    await new UserController(req, res).signUp();
});

router.get('/me', bearer, async (req, res) => {
    await new UserController(req, res).me();
});

router.delete('/logout', bearer, async (req, res) => {
    await new UserController(req, res).logOut();
});

router.post('/verifyemail', async (req, res) => {
    await new UserController(req, res).verifyEmail();
});

router.post('/setlocale', async (req, res) => {
    await new UserController(req, res).setLocale(req.body.locale);
});

router.post('/registerdevice', bearer, async (req, res) => {
    await new UserController(req, res).registerDevice();
});

router.get('/search/:searchValue', bearer, async (req, res) => {
    await new UserController(req, res).search(req.params.searchValue);
});

router.post('/validatetoken', bearer, async (req, res) => {
    await new UserController(req, res).validateToken();
});

router.post('/refreshtoken', async (req, res) => {
    await new UserController(req, res).refreshToken();
});

router.put('/edit/email', bearer, async (req, res) => {
    await new UserController(req, res).changeEmail();
});

router.put('/edit/password', bearer, async (req, res) => {
    await new UserController(req, res).changePassword();
});

export default router;