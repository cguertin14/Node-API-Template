import validator from 'validator';
import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import BaseController from './baseController';
import { codes, statuses, error } from '../errors/errors';
import { s3 } from '../../config/json/services.json';

export default class ImageController extends BaseController {
    _init() {
        this.s3 = new AWS.S3(s3);
    }

    upload() {
        try {
            const key = `${this.user.id}/${uuid()}.png`;
            this.s3.getSignedUrl('putObject', {
                Bucket: 'nightplanner',
                ContentType: 'image/png',
                Key: key
            }, (err, url) => {
                if (err) throw err;
                return this.res.json({ key, url });
            })
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, e.message)
            );
        }
    }
}