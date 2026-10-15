import { Module } from '@nestjs/common';
import { ClicksController } from './clicks.controller';
import { ClicksService } from './clicks.service';

@Module({
  controllers: [ClicksController],
  providers: [ClicksService],
  exports: [ClicksService]
})
export class ClicksModule {}
