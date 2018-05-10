export default class BaseController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.user = req.user;
    }
}