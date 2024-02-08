import { Test, TestingModule } from '@nestjs/testing';
import { WisataService } from './wisata.service';

describe('WisataService', () => {
  let service: WisataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WisataService],
    }).compile();

    service = module.get<WisataService>(WisataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
