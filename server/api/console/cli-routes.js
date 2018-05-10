import RoutesHelper from './routesListing';
import userRoutes from './../routes/users';
import facebookRoutes from './../routes/facebook';
import googleRoutes from './../routes/google';
import imageRoutes from './../routes/image';

// List all routes.
RoutesHelper.print('/users', userRoutes.stack);
RoutesHelper.print('/facebook', facebookRoutes.stack);
RoutesHelper.print('/google', googleRoutes.stack);
RoutesHelper.print('/image', imageRoutes.stack);