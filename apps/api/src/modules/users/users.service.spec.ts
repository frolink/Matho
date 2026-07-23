import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  it('reports itself as scaffolded', () => {
    expect(service.getStatus()).toMatchObject({ module: 'users', status: 'scaffolded' });
  });
});
