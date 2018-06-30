import { Restaurant } from "../api/models/Restaurant";
import { Venue } from "../api/models/Venue";
import _ from 'lodash';

/**
 * Venue search algorithm
 * @returns { Array }
 */
export const searchVenues = async (pattern, page = 1) => {
    const venues = await Venue.paginate({}, {
        sort: { name: 1 },
        populate: [
            { path: 'moodTypes.moodType', select: '-_id name' },
            { path: 'ageRangeTypes.ageRangeType', select: '-_id name' },
            { path: 'musicTypes.musicType', select: '-_id name' },
            { path: 'venueTypes.venueType', select: '-_id name' },
            { path: 'dressCodes.dressCode', select: '-_id name notWearableItems' }
        ],
        limit: 10,
        page
    });
    
    const data = venues.docs.filter(venue => {
        venue = venue.asToday();
        return venue.name.match(pattern) ||
            venue.description.match(pattern) ||
            venue.moodType.name.match(pattern) ||
            venue.ageRangeType.name.match(pattern) ||
            venue.musicType.name.match(pattern) ||
            venue.venueType.name.match(pattern) ||
            venue.dressCode.name.match(pattern) ||
            venue.amenity.match(pattern) ||
            venue.type.match(pattern) ||
            venue.price.toString().match(pattern) ||
            venue.priceRange.match(pattern) ||
            venue.typeOfClient.match(pattern) ||
            venue.time.match(pattern) ||
            venue.offered.find(o => o.match(pattern)) ||
            venue.dressCode.notWearableItems.includes(pattern);
    }).map(v => v.asToday());


    return {
        data,
        currentTotal: data.length,
        ..._.omit(venues, ['docs','limit'])
    };
};

/**
 * Restaurant search algorithm
 * @returns { Array }
 */
export const searchRestaurants = async (pattern, page = 1) => {
    const restaurants = await Restaurant.paginate({}, {
        sort: { name: 1 },
        populate: [
            { path: 'type', select: '-_id name' },
            { path: 'foodTypes', select: '-_id name' }
        ],
        limit: 10,
        page
    });

    const data = restaurants.docs.filter(resto => {
        return resto.address.match(pattern) ||
            resto.address.match(pattern) ||
            resto.address2.match(pattern) ||
            resto.aggregate_score.match(pattern) ||
            resto.city.match(pattern) ||
            resto.country.match(pattern) ||
            resto.state.match(pattern) ||
            resto.metro_name.match(pattern) ||
            resto.name.match(pattern) ||
            resto.price_quartile.match(pattern) ||
            resto.postal_code.match(pattern) ||
            resto.category.find(c => c.match(pattern)) ||
            resto.type.name.match(pattern) ||
            resto.foodTypes.find(f => f.name.match(pattern));
    });

    return {
        data,
        currentTotal: data.length,
        ..._.omit(restaurants, ['docs','limit'])
    };
};