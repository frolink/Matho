import { Test } from '@nestjs/testing';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AdminService],
    }).compile();

    service = module.get(AdminService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'admin', status: 'scaffolded' });
  });
});
