import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsGeneratorController } from './connections-generator.controller';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';
import { ConnectionsGeneratorService } from './connections-generator.service';
import { TypeGeneratorService } from '../type-generator/type-generator.service';

describe('ConnectionsGenerator Controller', () => {
  let controller: ConnectionsGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionsGeneratorController],
      providers: [ConnectionsGeneratorService, TypeGeneratorService, TypeHelperService]
    }).compile();

    controller = module.get<ConnectionsGeneratorController>(ConnectionsGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
