import { Test, TestingModule } from '@nestjs/testing';
import { TypeHelperService } from './type-helper.service';

describe('TypeHelperService', () => {
  let service: TypeHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeHelperService],
    }).compile();

    service = module.get<TypeHelperService>(TypeHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
