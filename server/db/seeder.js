// Config.
import '../config/config';
import './mongoose';

// Seeders.
import UsersCollectionSeeder from './seeds/users';
import FriendCollectionSeeder from './seeds/friends';

// Models.
import { User } from '../api/models/User';

(async () => {
    // Truncate tables
    User.remove({}, () => {});

    // Run seeders
    await new UsersCollectionSeeder().run();
    await new FriendCollectionSeeder().run();
})().then(process.exit)
    .catch(e => {
        console.error(e);
        process.exit(1);
    });