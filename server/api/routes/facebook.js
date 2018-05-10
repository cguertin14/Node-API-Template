import express from 'express';
import passport from 'passport';
import _ from 'lodash';
import FacebookController from './../controllers/social/facebookController';
import { bearer, facebook } from './../middlewares/authenticate';
const router = express.Router();

router.post('/login', facebook);

router.get('/login/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        res.json(_.pick(req, ['user']));
    });

router.post('/signup', async (req, res) => {
    await new FacebookController(req, res).signUp();
});

router.put('/link', async (req, res) => {
    await new FacebookController(req, res).linkAccount();
});

export default router;