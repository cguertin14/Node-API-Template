import BaseController from './baseController';
import StripeHelper from '../../config/payments/StripeHelper';
import { statuses, error, codes } from '../errors/errors';
import CardsValidator from '../validators/cards';

export default class CardController extends BaseController {
    async _init() {
        const keys = config[process.env.NODE_ENV];
        this.stripe = new StripeHelper(this.user.stripe_customer_id);
        this.validator = new CardsValidator(this);
    }

    async index() {
        try {
            let cards = await this.stripe.cards();
            const { defaultCard } = this.user;
            if (defaultCard) {
                cards = cards.map(c => _.assign({}, c, { default: c.id === defaultCard }));
            }
            return this.res.json({ cards });
        } catch (e) {
            return this.json.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async store() {
        try {
            const errors = this.validator.store();
            if (errors.length > 0)
                return this.status(statuses.NOT_ACCEPTABLE).json({ errors });

            const card = await this.stripe.createCard(this.checkBody.card_token);
            return this.status(statuses.CREATED_OR_UPDATED).json({ card });
        } catch (e) {
            return this.json.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async get(id) {
        try {
            const card = await this.stripe.getCard(id);
            return this.res.json({ card });
        } catch (e) {
            return this.json.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async remove(id) {
        try {
            const result = await this.stripe.deleteCard(id);
            return this.res.json({ result });
        } catch (e) {
            return this.json.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async setDefaultCard(id) {
        try {
            this.user.defaultCard = id;
            await this.user.save();
            return this.res.status(statuses.CREATED_OR_UPDATED).json({
                status: this.__('DefaultCard')
            });
        } catch (e) {
            return this.json.status(statuses.NOT_ACCEPTABLE).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            ); 
        }
    }
}