import RoutesHelper from './routesListing';
import userRoutes from './../routes/users';

// List all routes.
RoutesHelper.print('/users', userRoutes.stack);