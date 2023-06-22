import { Router } from "express";
import productController from "../../controllers/productController";
import validateDto from "../../middlewares/validateDTO/validateDTO";
import { productSchemas } from "../../middlewares/schemas/productSchema";
import Authentication from "../../middlewares/authentication/authentication";
import upload from "../../uploads/uploads";

const productRoutes = Router();

productRoutes.get("/products", productController.listProducts);
productRoutes.get("/products/search/:keyword", validateDto(productSchemas.search), productController.searchProduct);
productRoutes.get("/products/:category", validateDto(productSchemas.findBycategory), productController.fetchByCategory);
// productRoutes.get("/products/pages/:id", productController.listProductsByPage)
productRoutes.post("/products", Authentication.authAdmin,upload.array("images"), validateDto(productSchemas.newProduct),productController.createProduct);
productRoutes.put("/products/:id", Authentication.authAdmin,upload.array("images"),validateDto(productSchemas.updateProduct), productController.updateProduct);
// productRoutes.get("/products/:id", productController.fetchProductById);
productRoutes.post("/products/:id/images", Authentication.authAdmin, validateDto(productSchemas.onlyIdRequired), upload.array("images"), productController.newImage);
productRoutes.delete("/products/images/:id", Authentication.authAdmin, validateDto(productSchemas.onlyIdRequired), productController.deleteImage);
productRoutes.delete("/products/:id", Authentication.authAdmin,validateDto(productSchemas.onlyIdRequired), productController.deleteProduct);




export default productRoutes;