import stripePackage from 'stripe';
import { stripe as config } from '../json/services.json';

/**
 * Stripe Helper class.
 */
export default class StripeHelper {
    constructor(id = null) {
        const stripe = config['development']; // TODO: change to [process.env.NODE_ENV];
        this.stripe = stripePackage(stripe.sk);
        this.cusId = id;
    }

    async asCustomer() {
        return await this.stripe.customers.retrieve(this.cusId);
    }

    async createCustomer(email) {
        return await this.stripe.customers.create({ email });
    }

    async cards() {
        return await this.stripe.customers.listCards(this.cusId);
    }

    async createCard(source) {
        return await this.stripe.createSource(this.cusId, { source });
    }

    async getCard(id) {
        return await this.stripe.customers.retrieveCard(id);
    }

    async deleteCard(id) {
        return await this.stripe.customers.deleteCard(this.cusId, id);
    }

    async createCharge(amount) {
        return await this.stripe.charges.create({
            amount,
            currency: 'cad',
            customer: this.cusId,
        });
    }
}