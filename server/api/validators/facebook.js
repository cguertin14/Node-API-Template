import Validator from './validator';

/**
 * Facebook Validator Class
 */
export default class FacebookValidator extends Validator {
    /**
     * Facebook login validator.
     * @returns { Array }
     */
    login() {
        this.checkBody('access_token', this.__('Required %s', 'Access Token')).notEmpty();
        return this.req.validationErrors() || [];
    }

    /**
     * Facebook SignUp validator.
     * @returns { Array }
     */
    signUp() {
        this.checkBody('access_token', this.__('Required %s', 'Access Token')).notEmpty();
        this.checkBody('musicPreferences', this.__('Required %s', 'Music preferences')).notEmpty();
        this.checkBody('musicPreferences', this.__('NotAnArray %s', 'Music preferences')).isArray();
        this.checkBody('musicPreferences.*', this.__('InvalidArrayContent %s', 'Music preferences')).exists().isIdValid();
        this.checkBody('venuePreferences', this.__('Required %s', 'Venue preferences')).notEmpty();
        this.checkBody('venuePreferences', this.__('NotAnArray %s', 'Venue preferences')).isArray();
        this.checkBody('venuePreferences.*', this.__('InvalidArrayContent %s', 'Venue preferences')).exists().isIdValid();
        this.checkBody('foodPreferences', this.__('Required %s', 'Food preferences')).notEmpty();
        this.checkBody('foodPreferences', this.__('NotAnArray %s', 'Food preferences')).isArray();
        this.checkBody('foodPreferences.*', this.__('InvalidArrayContent %s', 'Food preferences')).exists().isIdValid();
        this.checkBody('ageRangePreferences', this.__('Required %s', 'Age Range preferences')).notEmpty();
        this.checkBody('ageRangePreferences', this.__('NotAnArray %s', 'Age Range preferences')).isArray();
        this.checkBody('ageRangePreferences.*', this.__('InvalidArrayContent %s', 'Age Range preferences')).exists().isIdValid();
        return this.req.validationErrors() || [];
    }

    /**
     * Facebook link account validator.
     * @returns { Array }
     */
    linkAccount() {
        this.checkBody('fb_access_token', this.__('Required %s', 'Facebook Access Token')).notEmpty();
        return this.req.validationErrors() || [];
    }
}