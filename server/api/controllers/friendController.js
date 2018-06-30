import _ from 'lodash';
import BaseController from './baseController';
import { User } from './../models/User';
import { statuses, codes, error } from '../errors/errors';
import FriendsValidator from '../validators/friends';
import { ObjectID } from 'mongodb';

export default class FriendController extends BaseController {
    _init() {
        this.validator = new FriendsValidator(this);
    }

    async index() {
        try {
            const { friends } = this.user;
            return this.res.json({ friends });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async get(id) {
        try {
            const friend = this.user.friends.includes(ObjectID(id));
            if (friend) return this.res.json({ friend: _.omit(friend.toJSON(), ['_id']) });
            throw new Error();
        } catch (e) {
            return this.res.status(statuses.NOT_FOUND).json(
                error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('NotFound %s', 'friend'))
            );
        }
    }

    async invite(id) {
        try {
            if (id === this.user.id) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('FriendIsMe'))
                );
            }

            const friend = await User.findById(id).cache();
            if (!friend) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('NotFound %s', 'Friend'))
                );
            }

            const friendIsInList = this.user.friends.includes(ObjectID(id));
            const friendInvitedMe = this.user.friendInvites.includes(ObjectID(id));
            const friendHasReceivedInvitation = friend.friendInvites.includes(ObjectID(this.user.id));
            if (friendIsInList) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('FriendExists'))
                );
            } else if (friendInvitedMe) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('FriendInvitedMe', friend.getFullname()))
                );
            } else if (friendHasReceivedInvitation) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('FriendRequestAlreadySent'))
                );
            }

            // Invite friend.
            friend.friendInvites.push(this.user.id);
            await friend.save();
            return this.res.status(statuses.CREATED_OR_UPDATED).json({
                status: this.__('FriendRequestSent')
            });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }

    async answer(id) {
        try {
            const errors = this.validator.answer();
            if (errors.length > 1)
                return this.res.status(statuses.NOT_ACCEPTABLE).json({ errors });

            let friendInvite = this.user.friendInvites.find(i => i._id.toHexString() === id);
            if (!friendInvite) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('NotFound %s', 'Friend invitation'))
                )
            }

            let friend = await User.findById(id);
            const { status } = this.req.body;

            // Add other user as friend to current user.
            let accepted = false;
            if (status === 'accepted') {
                this.user.friends.push(friendInvite);
                await this.user.save();
                accepted = true;
                // Send NOTIFICATION to friend to tell him current user accepted him/her.
            }
            await this.user.removeInvite(id);

            // Add current user to other user as friends.
            friend.friends.push(this.user.id);
            await friend.save();

            return this.res.status(statuses.CREATED_OR_UPDATED).json({
                status: this.__(accepted ? 'FriendRequestAccepted' : 'FriendRequestRefused')
            });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('NotFound %s', 'Friend'))
            );
        }
    }

    async remove(id) {
        try {
            let friend = this.user.friends.find(f => f._id.toHexString() === id);
            if (!friend) {
                return this.res.status(statuses.NOT_ACCEPTABLE).json(
                    error(codes.UNACCEPTABLE_CONTENT_ERROR, this.__('NotFound %s', 'Friend'))
                )
            }
            await this.user.removeFriend(id);
            await friend.removeFriend(this.user.id);
            return this.res.json({ status: this.__('Removed %s', 'Friend') });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('NotFound %s', 'Friend'))
            );
        }
    }

    async invites() {
        try {
            const { friendInvites } = this.user;
            return this.res.json({ friendInvites: await Promise.all(friendInvites.map(async f => await f.toShort())) });
        } catch (e) {
            return this.res.status(statuses.INTERNAL_SERVER_ERROR).json(
                error(codes.INTERNAL_ERROR, this.__('InternalError'))
            );
        }
    }
}