import './../mongoose';
import UsersTableSeeder from './users';
import { User } from '../../api/models/user';

(async () => {
    // Truncate tables
    User.remove({}, () => {});

    // Run seeders
    await new UsersTableSeeder().run();
})();