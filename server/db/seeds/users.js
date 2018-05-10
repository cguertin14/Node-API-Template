import Seeder from './seed';
import { User } from '../../api/models/user';
import faker from 'faker/locale/fr_CA';
import _ from 'lodash';
import asyncForEach from './../../utils/asyncForEach';

export default class UsersTableSeeder extends Seeder {
    async run() {
        await this.create(new User({
            email: 'a@a.ca',
            password: 'egologique',
            firstName: 'Martin',
            lastName: 'Deschamps'
        }));

        await asyncForEach(_.range(0, 20), async index => {
            const firstName = faker.name.firstName(1),
                  lastName  = faker.name.lastName(1);
            await this.create(new User({
                email: faker.internet.email(firstName, lastName, 'live.ca'),
                password: 'egologique',
                firstName,
                lastName,
                points: faker.random.number(999)
            }));
        });

        console.log('Users Seeder Done');
    }
}