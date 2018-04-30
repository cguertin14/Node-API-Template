import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from './../api/models/user';


// Bearer config....
passport.use(new BearerStrategy(
    async function(token, done) {
        try {
            let user = await User.findByToken(token);
            if(!user) {
                return done(null, false)
            }
            return done(null, user, { scope: 'all' });
        } catch (e) {
            return done(e);
        }
    }
));



// Facebook config....