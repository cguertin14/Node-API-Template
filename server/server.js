import './config/config.js';
import './config/passport.js';
import './db/mongoose';
import express from 'express';
import passport from 'passport';
import rateLimiter from './config/rateLimiter';
import userRoutes from './api/routes/users';
import facebookRoutes from './api/routes/facebook';
import googleRoutes from './api/routes/google';

// Express config
const port = process.env.PORT || 3000;
const app = express();

// Express plugins.
app.use(express.static('public'));
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('cors')());
app.use(require('express-validator')());
app.use(rateLimiter);
app.use(passport.initialize());
app.use(passport.session());

// Routes.
app.use('/users', userRoutes);
app.use('/facebook', facebookRoutes);
app.use('/google', googleRoutes);

// Listener.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export { app };