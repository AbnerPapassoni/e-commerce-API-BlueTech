import { NextFunction, Response, Request } from "express";
import apiError from "../utils/api/apiError";
import Product from "../repositories/productsRepository";
import ProductRepository from "../repositories/productsRepository";
import storeImages from "../utils/storeImages";

export default class productController {

	static async listProducts(req: Request, res: Response, next: NextFunction) {
		try {
			const products = await Product.fetchProducts();
			return res.status(200).json(products);
		} catch (error) {
			next(error);
		}
	}

    static async searchProduct (req: Request, res: Response, next: NextFunction) {
        try{
            const {keyWord} = req.params;
            const products = await ProductRepository.searchProduct(keyWord);
            return res.status(200).json(products);
        }catch(error){
            next(error);
        }
    }

    static async fetchByCategory (req: Request, res: Response, next: NextFunction) {
        try {
            const products = await ProductRepository.fetchByCategory(
                req.params.category,
            );
            return res.status(200).json(products);
        }catch(error) {
            next(error)
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
            const { name, description, price, inventory, categories } = req.body.data;
            let images: string[] | undefined = undefined;
            if(req.files) {
                images = storeImages(req.files as Array<Express.Multer.File>);
            }
            const product = await ProductRepository.createProduct({
                name,
                description,
                price,
                inventory,
                categories,
                images,
            });
            return res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    static async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            let images: string[] | undefined = undefined;
            if(req.files) {
                images = storeImages(req.files as Array<Express.Multer.File>);
            }
            const { name, description, price, inventory, categories} = req.body.data;
            const product = await ProductRepository.updateProduct({
                id,
                name,
                description,
                price,
                inventory,
                categories,
                images,
            });
            return res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    static async deleteProduct(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        try {
            await ProductRepository.deleteProduct(id);
            return res.sendStatus(204)
        } catch (error) {
            next(error)
        }
    }

    static async newImage(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const images = storeImages(req.files as Array<Express.Multer.File>);
            const image = await ProductRepository.newImage(id, images);
            return res.status(201).json(image);
        }catch(error) {
            next(error);
        }
    }

    static async deleteImage(req: Request, res: Response, next: NextFunction) {
        try
         {
            const id = parseInt(req.params.id);
            await ProductRepository.deleteImage(id);
            return res.sendStatus(204);
         }catch(error) {
            next(error);
         }
    }
}
