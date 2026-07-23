import { Injectable } from '@nestjs/common';

/**
 * MerchantService — Store setup and merchant tooling.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class MerchantService {
  getStatus() {
    return {
      module: 'merchant',
      status: 'scaffolded',
      description: 'Store setup and merchant tooling',
    };
  }
}
