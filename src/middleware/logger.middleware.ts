import {Injectable, NestMiddleware, Logger} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction) {
        const {ip, method, originalUrl: url} = request || {};
        const hostname = require('os').hostname();
        const userAgent = request.get('user-agent') || '';
        const referer = request.get('referer') || '';

        response.on('close', () => {
            const {statusCode, statusMessage} = response;
            const contentLength = response.get('content-length');
            this.logger.log(`[${hostname}] "${method} ${url}" ${statusCode} ${statusMessage} ${contentLength} "${referer}" "${userAgent}" "${ip}"`);
        });
        next();
    }
}
