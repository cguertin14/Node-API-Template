import RoutesHelper from './routesListing';
import userRoutes from './../users';

// List all routes.
RoutesHelper.print('/users', userRoutes.stack);