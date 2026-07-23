import { Injectable } from '@nestjs/common';

/**
 * NotificationsService — User notification delivery.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class NotificationsService {
  getStatus() {
    return {
      module: 'notifications',
      status: 'scaffolded',
      description: 'User notification delivery',
    };
  }
}
