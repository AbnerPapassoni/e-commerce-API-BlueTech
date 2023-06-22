import { Router } from "express";
import Authentication from "../../middlewares/authentication/authentication";
import validateDto from "../../middlewares/validateDTO/validateDTO";
import { orderSchema } from "../../middlewares/schemas/orderSchema";
import OrderController from "../../controllers/orderController";

const orderRoutes = Router();

orderRoutes.get("/order/user/:id", Authentication.authClient, validateDto(orderSchema.idRequired), OrderController.fetchUserOrders);
orderRoutes.post("/order", Authentication.authClient, validateDto(orderSchema.create), OrderController.createOrder);
orderRoutes.delete("/order/:id", Authentication.authClient, validateDto(orderSchema.idRequired), OrderController.deleteOrder);
orderRoutes.get("/order", Authentication.authAdmin, OrderController.fetchAllOrders);
orderRoutes.put("/order/:id", Authentication.authAdmin, validateDto(orderSchema.update), OrderController.updateOrder);
orderRoutes.get("/order/product/:id", Authentication.authAdmin, validateDto(orderSchema.idRequired), OrderController.fetchOrdersByProduct);

export default orderRoutes;

