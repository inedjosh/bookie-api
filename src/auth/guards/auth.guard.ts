import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenFactory } from '../utils/tokens.utils';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly tokenFactory: TokenFactory,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request): Promise<boolean> {
    const bearerToken = request.headers.authorization as string;

    if (!bearerToken)
      throw new UnauthorizedException(
        'Please provide Bearer token in Authorization header.',
      );

    const authToken = bearerToken.split(' ')[1];

    if (!authToken)
      throw new UnauthorizedException(
        'Auth token not found in Authorization header.',
      );

    const decodedToken = await this.tokenFactory.verifyToken(
      this.configService.get('ACCESS_TOKEN_SECRET'),
      authToken,
    );

    if (!decodedToken)
      throw new UnauthorizedException(
        'Invalid auth token or token has expired, please login to get new token.',
      );

    const session = await this.authRepository.getSession(decodedToken.id);

    if (!session) throw new UnauthorizedException('Please login again.');
    request['user'] = session;

    return true;
  }
}
