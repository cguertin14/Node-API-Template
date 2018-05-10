import { User } from './../models/user';
import passport from 'passport';

// Bearer middleware
export const bearer = (req, res, next) => {
    passport.authenticate('bearer', { session: false }, function (err, user, info) {
        // Error thrown
        if (err) return next(err);

        // Authentication Error
        if (!user) return res.status(401).json({ error: info.message || 'Invalid Token' });

        // Authentication Success
        let bearer = req.headers.authorization;
        req.token = bearer.substring(bearer.length, 7);
        req.user = user;
        next();
    })(req, res, next);
};

// Facebook middleware
export const facebook = (req, res, next) => {
    passport.authenticate('facebook')(req, res, next);
};

// Google middleware
export const google = (req, res, next) => {
    passport.authenticate('google')(req, res, next);
};