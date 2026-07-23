import { Injectable } from '@nestjs/common';

/**
 * LiveService — Live commerce streaming sessions.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class LiveService {
  getStatus() {
    return {
      module: 'live',
      status: 'scaffolded',
      description: 'Live commerce streaming sessions',
    };
  }
}
