import { NextFunction, Response, Request } from "express";
import { AnySchema } from "yup";

export default function validateDto(
    schema: { body?: AnySchema; params?: AnySchema },
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {            
            if (req.body.data) {
                req.body.data = JSON.parse(req.body.data);
            }            
            req.body = await schema.body?.validate(req.body);
            req.params = await schema.params?.validate(req.params);
            next();
        } catch (error) {
            next(error);
        }
    };
}