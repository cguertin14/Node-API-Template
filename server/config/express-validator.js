import { Types } from 'mongoose';
import customValidator from 'express-validator';
import validator from 'validator';
import moment from 'moment';
import util from 'util';

export default customValidator({
    customValidators: {
        isIdValid(value, id) {
            return value.match(/^[0-9a-fA-F]{24}$/) &&
                   Types.ObjectId.isValid(value);
        },
        isShortDate(value, id) {
            return moment(value, 'YYYY-MM-DD').isValid();
        },
        isLongDate(value, id) {
            return moment(value, 'YYYY-MM-DD HH:MM:SS').isValid();
        },
        isDateGtToday(value, id) {
            return moment(value).isAfter(moment().valueOf());
        },
        isDistinct(value, id) {
            if (!(value instanceof Array)) return false;
            return (new Set(value)).size === value.length
        }
    }
});