import { User } from './../models/user';
import _ from 'lodash';
import { ObjectId } from 'mongodb';

export default class UserController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async signUp() {
        try {
            let body = _.pick(this.req.body, ['email', 'password']);
            let user = new User(body);
            await user.save();
            // Create new token
            let token = await user.generateAuthToken();
            return this.res.status(201).send({ user, token });
        } catch (e) {
            return this.res.status(400).send(e);
        }
    }
    
    async logIn() {
        try {
            let body = _.pick(this.req.body, ['email', 'password']);
            let user = await User.findByCredentials(body.email, body.password);
            // Create new token
            let token = await user.generateAuthToken();
            return this.res.send({ user, token });
        } catch (e) {
            return this.res.status(401).send({
                status: 'Wrong credentials.'
            });
        }
    }
    
    me() {
        return this.res.send({ user: this.req.user });
    }
    
    async logOut() {
        try {
            await this.req.user.removeToken(this.req.token);
            return this.res.status(200).send({ 
                success: true,
                status: 'Logged out'
            });
        } catch (e) {
            return this.res.status(400).send({ success: false })
        }
    }
}