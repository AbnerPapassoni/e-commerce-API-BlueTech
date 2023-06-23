import { NextFunction, Response, Request } from "express";
import jwtk from "../../utils/jwt";
import apiError from "../../utils/api/apiError";
import { TokenExpiredError } from "jsonwebtoken";



export default class Authentication {
    static authClient(req: Request, res: Response, next: NextFunction) {
        try {
            Authentication.verify(req, res);
            next();
        } catch (error) {
            next(error);
        }
    }

    static authAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const user = Authentication.verify(req, res);
            if (user?.role !== "admin") {
                throw new apiError(403, "Exclusive access for administrators.");
            }
            next()
        } catch (error) {
            next(error);
        }
    }

    private static verify(req: Request, res: Response) {
        try {
            return jwtk.verify(req.cookies.jsonwebtoken);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                jwtk.verifyRefresh(req.cookies.refreshtoken);
                const user = jwtk.decode(req.cookies.jsonwebtoken);
                const token = jwtk.createToken({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                });
                const refreshtoken = jwtk.createRefreshToken(user.email);
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

                    return user.name, user.email; 
            } else {
                throw error;
            }
        }
    }

    static validateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params;
            const jwt = jwtk.decode(req.cookies.jsonwebtoken);
            if (jwt.role === "client" && jwt.email !== email) {
                throw new apiError(403, "Unauthorized user!");
            }
            next()
        } catch (error) {
            next(error);
        }
    }
}