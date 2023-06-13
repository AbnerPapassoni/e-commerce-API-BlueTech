import { NextFunction, Response, Request } from "express";
import apiError from "../utils/api/apiError";
import Product from "../repositories/productsRepository";

export default class productController {

	static async listProducts(req: Request, res: Response, next: NextFunction) {
		try {
			const products = await Product.fetchProducts();
			return res.status(200).json(products);
		} catch (error) {
			next(error);
		}
	}

    static async listProductsByPage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const products = await Product.fetchProductsByPage(Number(id));
            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    static async fetchProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await Product.fetchProductId(Number(id));
            if (!product) { throw new apiError(404, "🔎 Product not found for this ID.") };
            return res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, price, inventory } = req.body;
            const product = await Product.createProduct({
                name,
                description,
                price,
                inventory,
            });
            return res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, price, inventory } = req.body;
            const product = await Product.updateProduct({
                id:(Number(id)),
                name,
                description,
                price,
                inventory
            });
            return res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await Product.deleteProduct(Number(id));
            return res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }
}
