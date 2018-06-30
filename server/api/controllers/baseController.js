/**
 * BaseController class.
 */
export default class BaseController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.user = req.user;
        this.__ = this.res.__;
        this.checkBody = this.req.checkBody;

        this._init();
    }

    _init() {}
}