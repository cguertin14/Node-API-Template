import expect from 'expect';
import request from 'supertest';
import _ from 'lodash';
import { ObjectId } from 'mongodb';
import { app } from './../server';
import { User } from './../api/models/user';
import { users, populateUsers } from './seed/seed';

beforeEach(populateUsers);

describe('GET /users/me', () => {
    it('should return a user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({ error: 'Token is required.' });
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '123456';

        request(app)
            .post('/users')
            .type('urlencoded')
            .send({ email, password })
            .expect(201)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.user._id).toBeTruthy();
                expect(res.body.user.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return a validation errors if request is invalid', (done) => {
        let email = 'example.com';
        let password = '123456';

        request(app)
            .post('/users')
            .type('urlencoded')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        let email = users[0].email;
        let password = '123456';

        request(app)
            .post('/users')
            .type('urlencoded')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        let email = users[1].email, password = users[1].password;
        request(app)
            .post('/users/login')
            .type('urlencoded')
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        let email = 'a@a.a', password = 'jaqueline';
        request(app)
            .post('/users/login')
            .type('urlencoded')
            .send({ email, password })
            .expect(401)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .type('urlencoded')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            })
    });
});