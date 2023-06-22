import { prisma } from "../database/db";
import express from 'express';
import bcrypt from 'bcrypt';
import apiError from "../utils/api/apiError";


const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });


export default class User {
    static async fetchUsers() {
        return await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                role: true
            },
        });
    }

    static async fetchUseId(id: number, includePassword = false) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                name: true,
                email: true,
                password: includePassword,
                role: true
            },
        });
    }

    static async fetchUserEmail(email: string, includePassword = false) {
        return await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: includePassword,
                role: true
            },
        });
    }

    static async createUser({
        name,
        email,
        password,
        role
    }: {
        name: string;
        email: string;
        password: string;
        role: "admin" | "client";
    }) {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 8),
                role,
            }
        });

        return {
            name: user.name,
            email: user.email,
            role: user.role,
        }
    }

    static async updateUser({
        name,
        email,
        password,

    }: {
        name?: string;
        email: string;
        password?: string;
    }) {
        const user = await prisma.user.update({
            where: { email },
            data: {
                name,
                password: password ? await bcrypt.hash(password, 8) : undefined,
            }
        })

        return {
            name: user.name,
            email: user.email,
            role: user.role,
        }
    }
    static async deleteUser(email: string) {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { email },
                select: { id: true },
            });
            if (!user) throw new apiError(404, "Usuário não encontrado.");
            const orders = await tx.order.findMany({
                where: { userId: user.id },
                select: { id: true },
            });
            await tx.productOrder.deleteMany({
                where: { orderId: { in: orders.map((o) => o.id) } },
            });
            await tx.order.deleteMany({
                where: { userId: user.id },
            });
            await tx.user.delete({
                where: { email },
            });
        });
    }

}

