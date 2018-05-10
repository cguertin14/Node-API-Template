import ImageController from './../controllers/imageController';
import express from 'express';
import { bearer } from './../middlewares/authenticate';
const router = express.Router();

router.get('/:id', bearer, async (req, res) => {
    await new ImageController(req, res).get(req.params.id);
});

router.post('/', bearer, async (req, res) => {
    await new ImageController(req, res).upload();
});

export default router;