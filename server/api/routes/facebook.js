import express from 'express';
import passport from 'passport';
import _ from 'lodash';
import FacebookController from './../controllers/facebookController';
import { bearer } from './../middlewares/authenticate';
const router = express.Router();

router.post('/login', async (req, res) => {
    await new FacebookController(req, res).login();
});

router.post('/signup', async (req, res) => {
    await new FacebookController(req, res).signUp();
});

router.put('/link', bearer, async (req, res) => {
    await new FacebookController(req, res).linkAccount();
});

export default router;