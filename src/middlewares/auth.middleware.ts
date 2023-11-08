import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log('Request...');
    const authheader = req.headers['auth-user'];
    if (!authheader) {
      return res.status(401).send('auth-header introuvable');
    }
    const token = String(authheader);
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET);
      if (decodedToken.includes('userId')) {
        req['userId'] = decodedToken['userId'];
        next();
      } else {
        return res.status(401).send('Token Invalide');
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
