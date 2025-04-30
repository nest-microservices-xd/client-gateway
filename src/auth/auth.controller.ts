import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';
import { Request } from 'express';

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

  @Post('verify')
  verify(@Req() req: Request) {
    console.log(req.headers);
    return this.client.send('verifyToken', {});
  }
}
