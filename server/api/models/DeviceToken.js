import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import validator from 'validator';
import { baseConfig, refValidator } from '../../utils/mongoose';
import { User } from './User';
const { Types } = mongoose.Schema;

const DeviceTokenSchema = new mongoose.Schema({
    platform: baseConfig(String),
    token: baseConfig(String),
    user: baseConfig(Types.ObjectId, { ref: 'User', validate: refValidator(User, 'user') })
}, { timestamps: true });

export const DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);