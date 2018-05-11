import BaseController from './baseController';
import { Image } from './../models/image';
import imageCache from 'image-cache';
import path from 'path';
import { encode, decode } from 'node-base64-image';


export default class ImageController extends BaseController {
    _init() {
        imageCache.setOptions({
            dir: path.join(__dirname, 'server/cache/')
        });
    }

    async get(id) {
        const image = await Image.findById(id);
        if (!image) return this.res.status(404).json({ error: 'Image not found' });

        // Cache and make image then return it to the client (CONTENT -> BASE64).
        /*imageCache.getCache(`${process.env.URL}/image/${image._id.toString()}`, (err, res) => {
            
        });*/
        
        const buffer = new Buffer(image.content, 'base64');
        this.res.writeHead({
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
        });
        return this.res.end(buffer);
    }

    async upload() {

    }
}