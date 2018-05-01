import { ObjectId } from 'mongodb';
import { User } from './../../api/models/user';
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

const populateUsers = async (done) => {
    await User.remove({})
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();
    await Promise.all([userOne, userTwo]);
    done();
};

export { users, populateUsers };