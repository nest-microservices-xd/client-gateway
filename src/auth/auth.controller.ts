import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';
import { Request } from 'express';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { UserInterface } from './interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.client.send('login', loginDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.client.send('register', registerDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@User() user: UserInterface, @Token() token: string) {
    return { user, token };
  }
}
