import Validator from './validator';
import validator from 'validator';

/**
 * User Validator Class.
 */
export default class UserValidator extends Validator {
    /**
     * @returns { Array }
     */
    signUp() {
        this.checkBody('email', this.__('Required %s', 'Email')).notEmpty();
        this.checkBody('email', this.__('Email')).trim().isEmail().normalizeEmail();
        this.checkBody('password', this.__('Required %s', 'Password')).notEmpty();
        this.checkBody('firstName', this.__('Required %s', 'Firstname')).notEmpty();
        this.checkBody('lastName', this.__('Required %s', 'Lastname')).notEmpty();
        this.checkBody('gender', this.__('Required %s', 'Gender')).notEmpty();
        if (this.req.body.password !== undefined) {
            this.checkBody('password', this.__('PasswordLength %s', 'password')).custom(password => password.length >= 6);
        }
        if (this.req.body.birthdate !== undefined) {
            this.checkBody('birthdate', this.__('InvalidDate %s', 'birthdate')).isShortDate();
            this.checkBody('birthdate', this.__('Required %s', 'birthdate')).notEmpty();
        }
        if (this.req.body.musicPreferences !== undefined) {
            this.checkBody('musicPreferences', this.__('Required %s', 'Music preferences')).notEmpty();
            this.checkBody('musicPreferences', this.__('NotAnArray %s', 'Music preferences')).isArray();
            this.checkBody('musicPreferences', this.__('UniqueArray %s', 'Music preferences')).isDistinct();
            this.checkBody('musicPreferences.*', this.__('InvalidArrayContent %s', 'Music preferences')).exists().isIdValid();
        }
        if (this.req.body.venuePreferences !== undefined) {
            this.checkBody('venuePreferences', this.__('Required %s', 'Venue preferences')).notEmpty();
            this.checkBody('venuePreferences', this.__('NotAnArray %s', 'Venue preferences')).isArray();
            this.checkBody('venuePreferences', this.__('UniqueArray %s', 'Venue preferences')).isDistinct();
            this.checkBody('venuePreferences.*', this.__('InvalidArrayContent %s', 'Venue preferences')).exists().isIdValid();
        }
        if (this.req.body.foodPreferences !== undefined) {
            this.checkBody('foodPreferences', this.__('Required %s', 'Food preferences')).notEmpty();
            this.checkBody('foodPreferences', this.__('NotAnArray %s', 'Food preferences')).isArray();
            this.checkBody('foodPreferences', this.__('UniqueArray %s', 'Food preferences')).isDistinct();
            this.checkBody('foodPreferences.*', this.__('InvalidArrayContent %s', 'Food preferences')).exists().isIdValid();
        }
        if (this.req.body.ageRangePreferences !== undefined) {
            this.checkBody('ageRangePreferences', this.__('Required %s', 'Age Range preferences')).notEmpty();
            this.checkBody('ageRangePreferences', this.__('NotAnArray %s', 'Age Range preferences')).isArray();
            this.checkBody('ageRangePreferences', this.__('UniqueArray %s', 'Age Range preferences')).isDistinct();
            this.checkBody('ageRangePreferences.*', this.__('InvalidArrayContent %s', 'Age Range preferences')).exists().isIdValid();
        }
        return this.req.validationErrors() || [];
    }

    /**
     * @returns { Array }
     */
    login() {
        this.checkBody('email', this.__('Required %s', 'Email')).notEmpty();
        this.checkBody('password', this.__('Required %s', 'Password')).notEmpty();
        return this.req.validationErrors() || [];
    }

    /**
     * @returns { Array }
     */
    verifyEmail() {
        this.checkBody('email', this.__('Required %s', 'Email')).notEmpty();
        this.checkBody('email', this.__('EmailMustBeValid')).trim().isEmail().normalizeEmail();
        return this.req.validationErrors() || [];
    }

    /**
     * @returns { Array }
     */
    registerDevice() {
        this.checkBody('platform', this.__('Required %s', 'platform')).notEmpty();
        this.checkBody('platform', this.__('InvalidDevice')).custom(value => /(android|ios)/.test(value));
        this.checkBody('token', this.__('Required %s', 'token')).notEmpty();
        return this.req.validationErrors() || [];
    }

    /**
     * @returns { Array }
     */
    changeEmail() {
        this.checkBody('newEmail', this.__('Required %s', 'newEmail')).notEmpty();
        if (this.req.body.newEmail !== undefined) {
            this.checkBody('newEmail', this.__('InvalidFormat %s', 'newEmail')).custom(email => validator.isEmail(email));
        }
        return this.validationErrors() || [];
    }

    /**
     * @returns { Array }
     */
    changePassword() {
        this.checkBody('newPassword', this.__('Required %s', 'newPassword')).notEmpty();
        if (this.req.body.newPassword !== undefined) {
            this.checkBody('newPassword', this.__('PasswordLength %s', 'newPassword')).custom(password => password.length >= 6);
        }
        return this.validationErrors() || [];
    }
}