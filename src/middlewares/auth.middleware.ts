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
    // console.log(authheader);
    if (!authheader) {
      return res.status(401).send('auth-header introuvable');
    }
    const token = authheader as string;
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET);
      if (decodedToken['id']) {
        req['userId'] = decodedToken['id'];
        console.log(req['userId']);
        next();
      } else {
        return res.status(401).send('Token Invalide');
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
