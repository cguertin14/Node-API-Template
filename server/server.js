import './config/config';
import './config/passport.js';
import express from 'express';
import bodyParser from 'body-parser';
import { mongoose } from './db/mongoose';
import userRoutes from './api/routes/users';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

// Routes.
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export { app };