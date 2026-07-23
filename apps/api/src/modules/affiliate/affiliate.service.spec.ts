import { Test } from '@nestjs/testing';
import { AffiliateService } from './affiliate.service';

describe('AffiliateService', () => {
  let service: AffiliateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AffiliateService],
    }).compile();

    service = module.get(AffiliateService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'affiliate', status: 'scaffolded' });
  });
});
