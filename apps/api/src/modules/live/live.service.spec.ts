import { Test } from '@nestjs/testing';
import { LiveService } from './live.service';

describe('LiveService', () => {
  let service: LiveService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LiveService],
    }).compile();

    service = module.get(LiveService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'live', status: 'scaffolded' });
  });
});
