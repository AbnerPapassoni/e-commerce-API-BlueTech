import { Router } from "express";
import Authentication from "../../middlewares/authentication/authentication";
import userController from "../../controllers/userController";
import validateDto from "../../middlewares/validateDTO/validateDTO";
import { userSchema } from "../../middlewares/schemas/userSchema";

const userRoutes = Router();


userRoutes.get("/user", Authentication.authAdmin, userController.index); //ok
userRoutes.post("/user", validateDto(userSchema.createUser), userController.createUserClient); //ok
userRoutes.post("/user/admin", Authentication.authAdmin, validateDto(userSchema.createUser), userController.createUserAdmin); //ok
userRoutes.post("/user/login", validateDto(userSchema.login), userController.login); //ok
userRoutes.get("/user/logout", userController.logout); //ok
userRoutes.get("/user/:email", Authentication.authClient, Authentication.validateUserRole, userController.fetchByEmail); //ok
userRoutes.put("/user/:email", Authentication.authClient, Authentication.validateUserRole, validateDto(userSchema.updateUser), userController.update); //ok
userRoutes.delete("/user/:email", Authentication.authClient, Authentication.validateUserRole, validateDto(userSchema.deleteUser), userController.deleteUser) //OK

export default userRoutes;