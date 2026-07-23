import { Injectable } from '@nestjs/common';

/**
 * PaymentsService — Pi Network payment processing.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class PaymentsService {
  getStatus() {
    return {
      module: 'payments',
      status: 'scaffolded',
      description: 'Pi Network payment processing',
    };
  }
}
