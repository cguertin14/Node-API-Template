import _ from 'lodash';
import moment from 'moment';
import validator from 'validator';
import { Mongoose } from 'mongoose';

/**
 * Base config for a mongoose Schema attribute.
 * 
 * @param {*} type 
 */
export const baseConfig = (type, attributes = {}) => {
    let toReturn = {};
    if (type === String)
        toReturn = _.assign({}, { trim: true, minlength: 1 });
    return _.assign({}, toReturn, {
        type,
        required: true,
        ...attributes
    });
};

export const baseConfigUrl = (attributes = {}) => {
    return _.assign({}, {
        type: String,
        required: true,
        validate: {
            validator(val) {
                return validator.isURL(val);
            },
            message: '{VALUE} must be a valid url.'
        },
        ...attributes
    });
};

/**
 * Day config object for models.
 */
export const dayConfig = {
    type: Number,
    required: true,
    validate: {
        validator(val) {
            return val >= 1 && val <= 7;
        },
        message: '{VALUE} must be between 1 and 7 (inclusive).'
    }
};

/**
 * Basic date configuration for mongoose.
 * 
 * @param {*} attributes 
 */
export const dateConfig = (attributes = {}) => {
    return {
        type: Date,
        required: true,
        validate: {
            validator(val) {
                return moment(val).isValid();
            },
            message: '{VALUE} must be a valid timestamp.'
        },
        ...attributes
    }
};

/**
 * Ref validator for attributes which point on other models.
 * 
 * @param {*} model 
 * @param {*} name 
 */
export const refValidator = (model, name) => {
    return {
        isAsync: true,
        validator(val) {
            return model.findById(val).then(r => {
                if (r) return true;
                return false;
            });
        },
        message: `{VALUE} is not a valid ${name}.`
    }
};