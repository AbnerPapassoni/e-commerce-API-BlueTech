import { NextFunction, Response, Request } from "express";
import apiError from "../utils/api/apiError";
import ProductImage from "../repositories/productImageRepository";

export default class productImageController {
    static async addImage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const { link } = req.body;
            const image = await ProductImage.addImage({
                id:(Number(id)),
                link
            });
            return res.status(201).json(image)
        } catch (error) {
            next(error)
        }
    }
    
    static async updateImage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { productId, link } = req.body;
            const image = await ProductImage.updateImage({
                id:(Number(id)),
                productId,
                link
            });
            return res.status(200).json(image);
        } catch (error) {
            next(error);
        }
    }
    
    static async deleteImage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await ProductImage.deleteImage(Number(id));
            return res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }
}
