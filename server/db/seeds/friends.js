import Seeder from './seed';
import { User } from '../../api/models/User';
import faker from 'faker/locale/fr_CA';
import _ from 'lodash';
import asyncForEach from './../../utils/asyncForEach';

export default class FriendCollectionSeeder extends Seeder {
    async run() {
        const users = await User.find({});
        let testUser = users[0];

        // Add other friends, accept or refuse them
        const testInvites = _.chunk(_.shuffle(users), 4)[0];
        const testFriends = _.chunk(_.differenceWith(users, testInvites, _.isEqual), 4)[0];
        testUser.friends = testFriends.map(f => f._id);
        testUser.friendInvites = testInvites.map(f => f._id);
        await testUser.save();

        // Add testUser as friend to other users.
        await asyncForEach(testFriends, async friend => {
            friend.friends.push(testUser._id);
            await friend.save();
        });

        console.log('\x1b[32m', 'Friend Seeder Done');
    }
}