import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function NotionAdapter() {
    return {
        ...PrismaAdapter(prisma),
        async createUser(data) {
            return prisma.user.create({
                data: {
                    ...data,
                    connectors: {
                        create: {
                            type: "notion",
                            enabled: true,
                            config: {},
                        },
                    },
                },
            });
        },
    };
} 