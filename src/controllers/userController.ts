import { NextFunction, Response, Request } from "express";
import User from "../repositories/userRepository";
import apiError from "../utils/api/apiError";
import jwtk from "../utils/jwt";
import bcrypt from "bcrypt";


export default class userController {
    
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const user = await User.fetchUserEmail(email, true);
            if (!user) throw new apiError(404, "🔎User not found!");
            if (!bcrypt.compareSync(password, user.password)) {
                throw new apiError(400, "🛑 Invalid data!");
            }
            const token = jwtk.createToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

            const refreshtoken = jwtk.createRefreshToken(email);
            res.cookie("jsonwebtoken", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return res.sendStatus(200);

        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("jsonwebtoken");
            res.clearCookie("refreshtoken");
            return res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    static async index(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await User.fetchUsers();

            return res.status(200).json(users)
        } catch (error) {
            next(error);
        }
    }

    static async fetchById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await User.fetchUseId(parseInt(id));
            if (!user) { throw new apiError(404, "🔎 User not found for this ID.") };

            return res.status(200).json(user);

        } catch (error) {
            next(error);
        }
    }

    static async fetchByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params;
            const user = await User.fetchUserEmail(email);
            if (!user) { throw new apiError(404, "🔎 User not found for this email.") };

            return res.json(user);


        } catch (error) {
            next(error);
        }
    }

    static async createUserAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const user = await User.createUser({
                name,
                email,
                password,
                role: "admin",
            });
            return res.status(201).json(user)

        } catch (error) {
            next(error)
        }
    }

    static async createUserClient(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password } = req.body;
            const user = await User.createUser({
                name,
                email,
                password,
                role: "client",
            });
            return res.status(201).json(user)

        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params;
            const { name, password } = req.body;
            const user = await User.updateUser({
                name,
                email,
                password,
            });

            return res.status(200).json(user);

        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {

            const { email } = req.params;
            await User.deleteUser(email);
            return res.sendStatus(204)

        } catch (error) {
            next(error)
        }
    }
}