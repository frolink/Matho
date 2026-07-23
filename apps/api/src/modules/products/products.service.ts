import { Injectable } from '@nestjs/common';

/**
 * ProductsService — Product catalog, variants, and categories.
 * Phase 1 scaffold only. No business logic yet.
 */
@Injectable()
export class ProductsService {
  getStatus() {
    return {
      module: 'products',
      status: 'scaffolded',
      description: 'Product catalog, variants, and categories',
    };
  }
}
