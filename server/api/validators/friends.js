import Validator from './validator';

/**
 * Friends Validator Class
 */
export default class FriendsValidator extends Validator {
    /**
     * @returns { Array }
     */
    answer() {
        this.checkBody('status', this.__('Required %s', 'status')).notEmpty();
        this.checkBody('status', this.__('InvalidFriendStatus')).custom(value => /(accepted|refused)/.test(value));
        return this.req.validationErrors() || [];
    }
}