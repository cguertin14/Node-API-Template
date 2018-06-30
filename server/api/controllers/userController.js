import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import BaseController from './baseController';
import UserValidator from './../validators/users';
import { codes, statuses, error } from './../errors/errors';
import { DeviceToken } from '../models/DeviceToken';
import { blacklistToken, setTokens, tokenValidation } from '../../utils/tokens';

export default class UserController extends BaseController {
    _init() {
        this.validator = new UserValidator(this);
    }

    async signUp() {
        try {
            const errors = this.validator.signUp();
            if (errors.length > 0) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });
            }

            // Unique email validation
            if (await User.findOne({ email: this.req.body.email })) {
                return this.res.status(statuses.CONFLICT).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('Unique %s', 'Email'))
                );
            }

            // Create User
            const user = await User.create(this.req.body);
            // Create stripe customer
            await user.createCustomer();
            // Set locale
            const { locale } = this.req.cookies;
            if (locale) {
                if (user.locale !== locale) {
                    user.locale = locale;
                    await user.save();
                }
            }
            // Set tokens
            const { token, refreshToken } = setTokens(user, this.res);
            
            return this.res.status(statuses.CREATED_OR_UPDATED).json({ user, token, refreshToken });
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, e.message)
            );
        }
    }

    async me() {        
        const user = await User.populate(this.user, [
            { path: 'musicPreferences', select: 'name imageUrl' },
            { path: 'venuePreferences', select: 'name imageUrl' },
            { path: 'foodPreferences', select: 'name imageUrl' },
            { path: 'ageRangePreferences', select: 'name imageUrl' },
            { path: 'friends', select: 'firstName lastName imageUrl' },
        ]);
        return this.res.json({ user: user.toFull() });
    }

    async logOut() {
        try {
            await blacklistToken(this.req);
            this.req.logOut();
            this.req.session.destroy();
            return this.res.json({ status: this.__('LoggedOut') });
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('LogoutFailed'))
            );
        }
    }

    async verifyEmail() {
        try {
            const errors = this.validator.verifyEmail();
            if (errors.length > 0)
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

            let user = await User.findOne({ email: this.req.body.email });
            if (!user) return this.res.json({ status: this.__('EmailAvailable') });
            else throw new Error();
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('EmailTaken'))
            );
        }
    }

    async setLocale(locale) {
        if (!locale) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('LocaleRequired'))
            );
        }

        if (locale === 'fr' || locale === 'en') {
            this.res.setLocale(locale);
            this.res.cookie('locale', locale, { maxAge: 900000, httpOnly: true });
            return this.res.json({ status: this.__('LocaleChanged %s', locale) })
        } else {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, 'Locale must be either fr or en.')
            );
        }
    }

    async registerDevice() {
        try {
            const errors = this.validator.registerDevice();
            if (errors.length > 0)
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

            const payload = _.pick(this.req.body, ['token', 'platform']);
            if (await DeviceToken.findOne({ user: this.user.id, ...payload }))
                return this.res.json({ status: this.__('DeviceTokenExists') });

            // Create new device token.
            await DeviceToken.create({ user: this.user.id, ...payload });
            return this.res.status(statuses.CREATED_OR_UPDATED).json({ status: this.__('DeviceRegistered') });
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('InvalidData'))
            );
        }
    }

    async search(value) {
        try {
            const pattern = new RegExp(value, 'i');
            const users = await User.find({}).and([
                {
                    $or: [
                        { firstName: pattern },
                        { lastName: pattern },
                        { email: pattern }
                    ]
                }
            ]).cache();
            return this.res.json({ users });
        } catch (e) {
            return this.res.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('InvalidData'))
            );
        }
    }

    async changePassword() {
        try {
            const errors = this.validator.changePassword();
            if (errors.length > 0)
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

            const user = this.user,
                  { newPassword } = this.req.body;

            const isNotDifferent = await bcrypt.compare(newPassword, user.password);           
            if (isNotDifferent) {
                return this.res.status(statuses.CONFLICT).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('PasswordHasntChanged'))
                );
            }
            
            // Update user's password.       
            user.password = newPassword;
            await user.save();

            return this.res.status(statuses.CREATED_OR_UPDATED).json({ status: this.__('Updated %s', 'Password') });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, e.message)
            );
        }
    }

    async changeEmail() {
        try {
            const errors = this.validator.changeEmail();
            if (errors.length > 0)
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

            const user = this.user,
                  { newEmail } = this.req.body;
            
            // Check that new email is different than actual email
            if (await User.findOne({ email: newEmail })) {
                return this.res.status(statuses.CONFLICT).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('Unique %s', 'Email'))
                );
            }

            // Update user's email.       
            user.email = newEmail;
            await user.save();

            return this.res.status(statuses.CREATED_OR_UPDATED).json({ status: this.__('Updated %s', 'Email') });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async validateToken() {
        try {
            const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.req);
            jwt.verify(token, process.env.JWT_SECRET);
            return this.res.json({ status: 'Token is valid!' });
        } catch (e) {            
            return tokenValidation(e, this.res);
        }
    }

    async refreshToken() {
        try {
            // Extract refresh token from body.
            const oldRefreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(this.req);
            
            // Decode refresh token.
            const decoded = jwt.verify(oldRefreshToken, this.req.cookies.JWT_REFRESH);
            if (!decoded) throw new Error();

            // Invalidate Refresh Token (by replacing secret refreshing key).
            const user = await User.findById(decoded._id);
            const { token, refreshToken } = setTokens(user, this.res);

            return this.res.json({ token, refreshToken });
        } catch (e) {
            return this.res.status(statuses.UNAUTHORIZED).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, e.message)//TODO: Change to 'Refresh token has already been used.')
            );
        }
    }
}