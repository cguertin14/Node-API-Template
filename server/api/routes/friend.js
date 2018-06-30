import FriendController from './../controllers/friendController';
import { bearer } from './../middlewares/authenticate';
import express from 'express';
const router = express.Router();

router.get('/', bearer, async (req, res) => {
    // index de tous les amis du user.
    await new FriendController(req, res).index();
});

router.post('/:id', bearer, async (req, res) => {
    // ajouter un ami
    await new FriendController(req, res).invite(req.params.id);
});

router.get('/invites', bearer, async (req, res) => {
    await new FriendController(req, res).invites();
});

router.get('/:id', bearer, async (req, res) => {
    // get ami par id
    await new FriendController(req, res).get(req.params.id);
});

router.put('/:id', bearer, async (req, res) => {
    // accepter ou refuser un ami, fournir le status (0 ou 1) en body param
    await new FriendController(req, res).answer(req.params.id);
});

router.delete('/:id', bearer, async (req, res) => {
    // supprimer un ami
    await new FriendController(req, res).remove(req.params.id);
});

export default router;