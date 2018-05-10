import _ from 'lodash';
import mongoose from 'mongoose';
import moment from 'moment';
import validator from 'validator';

const ImageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        validate: {
            validator: validator.isBase64,
            message: 'Given value is not a valid base64 string.'
        }
    },
    createdAt: {
        type: Number,
        required: false,
        default: moment().valueOf()
    }
});

export const Image = mongoose.model('Image', ImageSchema);