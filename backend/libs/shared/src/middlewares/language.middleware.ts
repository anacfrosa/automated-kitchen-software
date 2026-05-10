import { NextFunction, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomRequest } from '../interfaces/request.interface';
import { fallbackLanguage } from '../constants/translation.constant';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const acceptedLanguages = req.headers['accept-language'];
    req.locale = acceptedLanguages?.split(',')[0]?.split(';')[0]?.split('-')[0] || fallbackLanguage;
    next();
  }
}
