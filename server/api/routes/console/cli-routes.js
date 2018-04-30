import routeListing from './routesListing';
import userRoutes from './../../../routes/users';

// List all routes.
routeListing('/users', userRoutes.stack);