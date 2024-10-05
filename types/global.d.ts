import { PrismaClient } from '@prisma/client';

declare global {
    // Disable eslint rule for the following line
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export { };
