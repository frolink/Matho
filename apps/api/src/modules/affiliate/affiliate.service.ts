import { Injectable } from '@nestjs/common';

/**
 * AffiliateService — Affiliate links and commission tracking.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class AffiliateService {
  getStatus() {
    return {
      module: 'affiliate',
      status: 'scaffolded',
      description: 'Affiliate links and commission tracking',
    };
  }
}
