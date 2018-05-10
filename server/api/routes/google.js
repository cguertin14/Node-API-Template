import express from 'express';
import passport from 'passport';
import _ from 'lodash';
import GoogleController from './../controllers/social/googleController';
import { bearer, google } from './../middlewares/authenticate';
const router = express.Router();

router.post('/login', google);

router.get('/login/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.json(_.pick(req, ['user']));
    });

router.post('/signup', async (req, res) => {
    await new GoogleController(req, res).signUp();
});

router.post('/link', async (req, res) => {
    await new GoogleController(req, res).linkAccount();
});

export default router;