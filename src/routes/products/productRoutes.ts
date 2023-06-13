import { Router } from "express";
import productController from "../../controllers/productController";
import productImageController from "../../controllers/productImageController";

const productRoutes = Router();

productRoutes.get("/products", productController.listProducts);
productRoutes.get("/products/pages/:id", productController.listProductsByPage)
productRoutes.post("/products", productController.createProduct);
productRoutes.put("/products/:id", productController.updateProduct);
productRoutes.get("/products/:id", productController.fetchProductById);
productRoutes.delete("/products/:id", productController.deleteProduct);

productRoutes.post("/products/:id/images", productImageController.addImage);
productRoutes.put("/products/images/:id", productImageController.updateImage);
productRoutes.delete("/products/images/:id", productImageController.deleteImage);


export default productRoutes;