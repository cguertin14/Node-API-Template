import { ObjectId } from 'mongodb';
import { User } from './../../models/user';
import jwt from 'jsonwebtoken';

// Seed data
const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
    {
        _id: userOneId,
        email: 'cg@live.ca',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'test@example.com',
        password: 'userTwoPass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
            }
        ]
    },
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    users,
    populateUsers
}