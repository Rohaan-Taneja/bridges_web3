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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async SignUp(
    @Body() authDetails: { EmailId: string; Password: string },
  ): Promise<number> {
    console.log('I am in the controller');

    const authResult = await this.authService.signUp(authDetails);
    return authResult;
  }

  @Get('getMyAccountAddress/:Uid')
  async getMyAccountAddress(@Param('Uid') userId: number) {
    try {
      const U_A_address = await this.authService.getAccountAddress(userId);
      if (!U_A_address) {
        throw new Error('no user found');
      }
      return U_A_address;
    } catch (Error) {
      throw new HttpException(
        {
          message: 'no user found',
          error: Error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('check')
  async check_txn() {
    const txn_object = await this.authService.Indexer();
    return txn_object;
  }
}
