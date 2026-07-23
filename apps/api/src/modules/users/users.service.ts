import { Injectable } from '@nestjs/common';

/**
 * UsersService — User accounts and profiles.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class UsersService {
  getStatus() {
    return {
      module: 'users',
      status: 'scaffolded',
      description: 'User accounts and profiles',
    };
  }
}
