import { Test, TestingModule } from '@nestjs/testing';
import { TypeGeneratorController } from './type-generator.controller';
import { TypeGeneratorService } from './type-generator.service';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';

describe('TypeGenerator Controller', () => {
  let controller: TypeGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeGeneratorController],
      providers: [TypeGeneratorService, TypeHelperService],
    }).compile();

    controller = module.get<TypeGeneratorController>(TypeGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
