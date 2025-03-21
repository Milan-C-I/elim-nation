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

export async function updateUser(id: string, data: Prisma.UserUpdateInput) {
    return await db.user.update({
        where: {
            id: id
        },
        data: data
    })
}

export async function updateUsers(data: (Prisma.UserUncheckedUpdateManyInput & { id: string })[]) {
    return await Promise.all(data.map(player => {
        const { id, ...p } = player;
        if (id) {
            return db.user.update({
                where: {
                    id: id
                },
                data: p
            })
        }
    }))
}

export async function deleteUser(id: number) {
    return await db.user.delete({
        where: {
            playerId: id
        }
    })
}

export async function startTimer(mins: number) {
    return await db.timer.create({
        data: {
            time: mins
        }
    })
}

export async function getTimer() {
    return await db.timer.findFirst({ orderBy: { startedAt: "desc" } });
}