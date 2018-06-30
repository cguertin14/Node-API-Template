import _ from 'lodash';
import PushNotifications from 'node-pushnotifications';
import config from './config.json';

/**
 * PushNotifications class.
 */
export default class NotificationHandler {
    constructor() {
        this.push = new PushNotifications(config);
    }

    /**
     * Send notification to android or ios.
     */
    send({ title, body }) {
        this.payload = { title, body };
        return this;
    }

    async to(devices) {
        try {
            const toSend = _.pick(this.payload, ['title', 'body']);
            return await this.push.send(devices, {
                ...toSend,
                topic: 'Artifex.NightPlanner-iOS',
                sound: 'default',
                alert: toSend,
                badge: 0, // TODO: Add notifications array in User model to count seen notifications
                custom: this.payload.data
            });
        } catch (e) {
            throw e;
        }
    }
}