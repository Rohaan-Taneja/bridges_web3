import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IndexingService } from './indexing.service';

@Controller('indexing')
export class IndexingController {
  constructor(private readonly indexingService: IndexingService) {}

  // this will be called by the fronend when txn is approved ,
  // from then on we will search for 10 block from now ,a dn check if there is any txn happend to our eth bridge contract
  @Post('indexChain')
  async indexChain() {
    try {
      const result = await this.indexingService.indexEthChain();

      if (!result!) {
        throw new Error('some issue in indexing');
      }

      return result;
    } catch (error) {
      console.log('we are getting error in indexing this event', error);
      throw new HttpException(
        {
          message: 'error in indexing chain',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
