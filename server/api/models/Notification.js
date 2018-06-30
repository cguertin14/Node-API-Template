import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import validator from 'validator';
import { baseConfig, refValidator } from '../../utils/mongoose';
import { User } from './User';
const { Types } = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
    user: baseConfig(Types.ObjectId, { ref: 'User', validate: refValidator(User) }),
    seen: baseConfig(Boolean, { required: false, default: false }),
    title: baseConfig(String),
    message: baseConfig(String),
    type: baseConfig(String, {
        validate: {
            validator(value) {
                return /(|)/.test(value); // TODO: Ajouter les possible values ici.
            },
            message: '{VALUE} can either be .... TODO: Ajouter les possible values ici.'
        }
    })
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);