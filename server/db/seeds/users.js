import Seeder from './seed';
import { User } from '../../api/models/User';
import faker from 'faker/locale/fr_CA';
import _ from 'lodash';
import moment from 'moment';
import asyncForEach from './../../utils/asyncForEach';
import countries from '../../config/json/countries.json';

export default class UsersCollectionSeeder extends Seeder {
    async run() {   
        const mappedCountries = countries.map(c => c.name);
        
        await User.create({
            email: 'test@np.com',
            password: 'nightplanner',
            phoneNumber: faker.phone.phoneNumber(),
            firstName: 'TestFirstname',
            country: _.shuffle(mappedCountries)[0],
            stripe_customer_id: 'cus_D8jkCt1HKtkdwp',
            defaultCard: 'card_1CiSGyEa3ylmHz49s76VEOjR',
            lastName: 'TestLastname',
            gender: 'male',
        });

        await User.create({
            email: 'test2@np.com',
            password: 'nightplanner',
            phoneNumber: faker.phone.phoneNumber(),
            firstName: 'Test2Firstname',
            country: _.shuffle(mappedCountries)[0],
            stripe_customer_id: 'cus_D8jkCt1HKtkdwp',
            defaultCard: 'card_1CiSGyEa3ylmHz49s76VEOjR',
            lastName: 'Test2Lastname',
            gender: 'male',
            birthdate: moment('1998-04-14').toDate(),
        });

        await asyncForEach(_.range(0, 20), async index => {
            const firstName = faker.name.firstName(1),
                  lastName = faker.name.lastName(1);
            await User.create({
                email: faker.internet.email(firstName, lastName, 'live.ca'),
                password: 'nightplanner',
                firstName,
                country: _.shuffle(mappedCountries)[0],
                phoneNumber: faker.phone.phoneNumber(),
                lastName,
                gender: _.shuffle(['male', 'female', 'other'])[0],
                birthdate: moment(faker.date.past(18).valueOf()).toDate(),
            });
        });

        console.log("\x1b[32m", 'Users Seeder Done');
    }
}