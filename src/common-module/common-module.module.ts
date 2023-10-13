import { Module, Global } from '@nestjs/common';
import { CommonModuleController } from './common-module.controller';
import { CommonModuleService } from './common-module.service';
import { v4 as uuid } from 'uuid';

const uuidProvider = {
  provide: 'UUID',
  useValue: uuid,
};

@Global()
@Module({
  exports: [uuidProvider],
  providers: [uuidProvider],
})
export class CommonModuleModule {}
