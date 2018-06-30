import NotificationController from './../controllers/notificationController';
import { bearer } from './../middlewares/authenticate';
import express from 'express';
const router = express.Router();

router.get('/', bearer, async (req, res) => {
    await new NotificationController(req, res).index();
});

router.delete('/clear', bearer, async (req, res) => {
    await new NotificationController(req, res).clear();
});

router.put('/seeall', bearer, async (req, res) => {
    await new NotificationController(req, res).seeAll();
});

export default router;