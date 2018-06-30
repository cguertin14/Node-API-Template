import BaseController from './baseController';
import { Notification } from './../models/Notification';
import { statuses, codes, error } from '../errors/errors';

export default class Controller extends BaseController {
    async index() {
        try {
            const notifications = await Notification.find({ user: this.user.id });
            return this.res.json({ notifications });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async clear() {
        try {
            await Notification.find({ user: this.user.id }).remove();
            return this.res.json({ status: this.__('Removed %s', 'Notifications') });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async seeAll() {
        try {
            await Notification.update({ user: this.user.id }, { seen: true }, { multi: true });
            return this.res.json({ status: this.__('Updated %s', 'Notifications') });
        } catch (error) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }
}