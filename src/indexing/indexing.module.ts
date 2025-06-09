import { Module } from '@nestjs/common';
import { IndexingService } from './indexing.service';
import { IndexingController } from './indexing.controller';

@Module({
  controllers: [IndexingController],
  providers: [IndexingService],
})
export class IndexingModule {}
