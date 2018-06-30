/**
 * Master Validator Class.
 */
export default class Validator {
    constructor(context) {
        this.context = context;
        this.__ = context.__;
        this.checkBody = context.checkBody;
        this.req = context.req;
        this.validationErrors = this.req.validationErrors;
    }
}