import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenFactory {
  constructor() {}

  async generateAccessToken(jwtSecret: string, payload: any, expiry?: string) {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: expiry || '1h',
    });

    return token;
  }

  async generateRefreshToken(jwtSecret: string, payload: any) {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '7d',
    });

    return token;
  }

  verifyToken = async (jwtSecret: string, token: string): Promise<any> => {
    try {
      const decodedJwt: any = jwt.verify(token, jwtSecret);

      return decodedJwt;
    } catch (error) {
      throw new UnauthorizedException('Token expired, login again');
    }
  };
}
