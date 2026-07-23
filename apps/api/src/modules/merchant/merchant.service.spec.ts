import { Test } from '@nestjs/testing';
import { MerchantService } from './merchant.service';

describe('MerchantService', () => {
  let service: MerchantService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MerchantService],
    }).compile();

    service = module.get(MerchantService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'merchant', status: 'scaffolded' });
  });
});
