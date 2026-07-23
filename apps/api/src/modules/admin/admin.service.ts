import { Injectable } from '@nestjs/common';

/**
 * AdminService — Internal operations and moderation.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class AdminService {
  getStatus() {
    return {
      module: 'admin',
      status: 'scaffolded',
      description: 'Internal operations and moderation',
    };
  }
}
