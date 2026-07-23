import { Test } from '@nestjs/testing';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'payments', status: 'scaffolded' });
  });
});
