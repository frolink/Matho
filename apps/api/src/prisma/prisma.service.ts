import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@matho/database';
import type { PrismaClient } from '@matho/database';

/**
 * Thin Nest-lifecycle wrapper around the shared @matho/database Prisma
 * singleton, so every module can inject `PrismaService` the idiomatic
 * Nest way while still sharing one connection pool app-wide.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient = prisma;

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
