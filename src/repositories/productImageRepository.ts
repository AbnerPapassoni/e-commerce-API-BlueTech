import { prisma } from "../database/db";
import apiError from "../utils/api/apiError";

export default class ProductImage {

    static async addImage({
        id,
        link
    }: {
        id: number;
        link: string;
    }) {
        const image = await prisma.productImage.create({
            data: {
                productId: id,
                link: link
            }
        });

        return {
            productId: image.productId,
            link: image.link
        }
    }

    static async updateImage({
        id,
        productId,
        link
    }: {
        id: number,
        productId?: number,
        link: string
    }) {
        const image = await prisma.productImage.update({
            where: { id },
            data: {
                productId,
                link
            }
        })

        return {
            productId: image.productId,
            link: image.link
        }
    }
    
    static async deleteImage(id: number) {
            const image = await prisma.productImage.delete({
                where: { id },
            });
            if (!image) throw new apiError(404, "Imagem não encontrado.");
    }
}