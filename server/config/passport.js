import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from './../api/models/user';
import socialConfig from './json/social.json';

// Bearer config....
passport.use(new BearerStrategy(
    async function (token, done) {
        try {
            let user = await User.findByToken(token);
            if (!user) {
                return done(null, false)
            }
            return done(null, user, { scope: 'all' });
        } catch (e) {
            return done(e);
        }
    }
));

// Facebook config....
passport.use(new FacebookStrategy(socialConfig.FACEBOOK,
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Google config....
passport.use(new GoogleStrategy(socialConfig.GOOGLE,
    function (token, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));