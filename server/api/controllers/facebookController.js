import _ from 'lodash';
import { FB, FacebookApiException } from 'fb';
import { User } from './../models/User';
import BaseController from './baseController';
import FacebookValidator from '../validators/facebook';
import { statuses, codes, error } from '../errors/errors';
import { setTokens } from '../../utils/tokens';

export default class FacebookController extends BaseController {
    _init() {
        this.config = JSON.parse(process.env.FB);
        this.validator = new FacebookValidator(this);
        FB.options(this.config);
    }

    async login() {
        const errors = this.validator.login();
        if (errors.length > 0)
            return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

        FB.setAccessToken(this.req.body.access_token);
        FB.api('me?fields=id', 'get', async res => {
            try {
                if (res) {
                    let user = await User.findOne({ facebookId: res.id, email: res.email });
                    if (user) {
                        // Set locale
                        const { locale } = this.req.cookies;
                        if (locale) {
                            if (user.locale !== locale) {
                                user.locale = locale;
                                await user.save();
                            }
                        }
                        const { token, refreshToken } = setTokens(user, this.res);
                        return this.res.json({ 
                            status: this.__('LoggedIn'),
                            user,
                            token,
                            refreshToken
                        });
                    }

                    return this.res.status(statuses.NOT_ACCEPTABLE).json(
                        error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('NotFound %s', 'User'))
                    );
                }
                throw new Error();
            } catch (e) {
                return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                    error(codes.INTERNAL_ERROR, this.__('FBError'))
                );
            }
        });
    }

    async signUp() {
        const errors = this.validator.signUp();
        if (errors.length > 0)
            return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });
        
        FB.setAccessToken(this.req.body.access_token);                  
        FB.api('me?fields=id,first_name,last_name,email,picture.width(400).height(400),gender', 'get', async res => {
            try {
                if (res.error) throw new Error();
                if (res) {                
                    if (await User.findOne({ facebookId: res.id, email: res.email })) {
                        return this.res.status(statuses.NOT_ACCEPTABLE).json(
                            error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('Unique %s', 'Facebook User'))
                        );
                    }
    
                    // Set preferences
                    const body = _.pick(this.req.body, ['foodPreferences','musicPreferences','venuePreferences','ageRangePreferences']);

                    // Create user
                    const user = await User.create({
                        facebookId: res.id,
                        email: res.email,
                        firstName: res.first_name,
                        lastName: res.last_name,
                        gender: res.gender,
                        profileImageUrl: res.picture.data.url,
                        ...body
                    });
                    // Set tokens
                    const { token, refreshToken } = setTokens(user, this.res);
                    // Set locale
                    const { locale } = this.req.cookies;
                    if (locale) {
                        if (user.locale !== locale) {
                            user.locale = locale;
                            await user.save();
                        }
                    }

                    return this.res.status(statuses.CREATED_OR_UPDATED).json({
                        status: this.__('LoggedIn'),
                        user,
                        token,
                        refreshToken
                    });
                }
                throw new Error();
            } catch (e) {
                return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                    error(codes.INTERNAL_ERROR, this.__('FBError'))
                );
            }
        });
    }

    async linkAccount() {
        const errors = this.validator.linkAccount();
        if (errors.length > 0)
            return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });
        
        FB.setAccessToken(this.req.body.fb_access_token);
        FB.api('me?fields=id', 'get', async res => {
            try {
                if (res) {
                    if (await User.findOne({ facebookId: res.id })) {
                        return this.res.status(statuses.NOT_ACCEPTABLE).json(
                            error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('Unique %s', 'Facebook User'))
                        );
                    }

                    this.user.facebookId = res.id;
                    await this.user.save();
                    return this.res.status(statuses.CREATED_OR_UPDATED).json({
                        status: this.__('FBLinked')
                    });
                }
                throw new Error();
            } catch (e) {
                return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                    error(codes.INTERNAL_ERROR, this.__('FBError'))
                );
            }
        });
    }
}