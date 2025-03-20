"use server"
import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function getUsers() {
    return await db.user.findMany();
}

export async function getUser(id: number) {
    return await db.user.findUnique({
        where: {
            playerId: id
        }
    });
}

export async function createUser({ playerId, name, blank, checked, eliminated }: Prisma.UserCreateInput) {
    return await db.user.create({
        data: {
            name,
            blank,
            checked,
            eliminated,
            playerId
        }
    });
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
    return await db.user.update({
        where: {
            playerId: id
        },
        data: data
    })
}

export async function updateUsers(data: Prisma.UserUncheckedUpdateManyInput[]) {
    return await db.user.updateMany({
        data: data
    })
}

export async function deleteUser(id: number) {
    return await db.user.delete({
        where: {
            playerId: id
        }
    })
}