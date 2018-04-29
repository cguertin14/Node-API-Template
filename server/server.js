import './config/config';
import _ from 'lodash';
import express from 'express';
import bodyParser from 'body-parser';
import { ObjectId } from 'mongodb';
import passport from 'passport';

// Middleware
import authenticate from './middleware/authenticate';

// Database code
import { mongoose } from './db/mongoose';
import { User } from './models/user';
// Passportjs config
import './config/passport.js';

// Server
const app = express();
// Port
const port = process.env.PORT || 3000;
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));




app.post('/users', async (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    try {
        await user.save();
        // Create new token
        let token = await user.generateAuthToken();
        return res.status(201).send({ user, token });
    } catch (e) {
        return res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send({ user: req.user });
});

app.post('/users/login', async (req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password']);
        let user = await User.findByCredentials(body.email, body.password);
        // Create new token
        let token = await user.generateAuthToken();
        return res.send({ user, token });
    } catch (e) {
        return res.status(401).send({
            status: 'Wrong credentials.'
        });
    }
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({ success: true });
    }).catch(e => res.status(400).send({ success: false }));
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports.app = app;