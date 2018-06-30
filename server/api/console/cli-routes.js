import RoutesHelper from './routesListing';

// List all routes.
RoutesHelper.print('/users', require('./../routes/user').default.stack);
RoutesHelper.print('/facebook', require('./../routes/facebook').default.stack);
RoutesHelper.print('/images', require('./../routes/image').default.stack);
RoutesHelper.print('/events', require('./../routes/event').default.stack);
RoutesHelper.print('/activities', require('./../routes/activity').default.stack);
RoutesHelper.print('/musictypes', require('./../routes/musicType').default.stack);
RoutesHelper.print('/venuetypes', require('./../routes/venueType').default.stack);
RoutesHelper.print('/foodtypes', require('./../routes/foodType').default.stack);
RoutesHelper.print('/ageranges', require('./../routes/ageRangeType').default.stack);
RoutesHelper.print('/friends', require('./../routes/friend').default.stack);
RoutesHelper.print('/cards', require('./../routes/card').default.stack);
RoutesHelper.print('/notifications', require('./../routes/notification').default.stack);
RoutesHelper.print('/venue/restaurant', require('./../routes/venueRestaurant').default.stack);
RoutesHelper.print('/venues', require('./../routes/venue').default.stack);
RoutesHelper.print('/restaurants', require('./../routes/restaurant').default.stack);

process.exit(0);