import CardController from './../controllers/cardController';
import { bearer } from './../middlewares/authenticate';
import express from 'express';
const router = express.Router();

router.get('/', bearer, async (req, res) => {
    await new CardController(req, res).index();
});

router.get('/:id', bearer, async (req, res) => {
    await new CardController(req, res).get(req.params.id);
});

router.post('/', bearer, async (req, res) => {
    await new CardController(req, res).store();
});

router.delete('/', bearer, async (req, res) => {
    await new CardController(req, res).remove(req.params.id);
});

router.put('/setdefault', bearer, async (req, res) => {
    await new CardController(req, res).setDefaultCard(req.params.id);
});

export default router;