import { number, object, string } from "yup";

const addProduct = {
    body: object({
        userEmail: string().email().required(),
        productId: number().required(),
        quantity: number().required(),
    }).defined()
}

const removeProduct = {
    body: object({
        userEmail: string().email().required(),
        productId: number().required(),
    }).defined(),
};

export {addProduct, removeProduct};