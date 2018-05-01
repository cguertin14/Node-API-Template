import './config/config.js';
import './config/passport.js';
import './db/mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './api/routes/users';

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Routes.
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export { app };