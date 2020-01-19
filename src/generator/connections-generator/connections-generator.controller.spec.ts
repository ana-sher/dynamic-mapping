import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsGeneratorController } from './connections-generator.controller';

describe('ConnectionsGenerator Controller', () => {
  let controller: ConnectionsGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionsGeneratorController],
    }).compile();

    controller = module.get<ConnectionsGeneratorController>(ConnectionsGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
