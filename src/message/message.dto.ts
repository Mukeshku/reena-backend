import { credential, initializeApp, messaging, app } from 'firebase-admin';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MessageDto {
    @ApiPropertyOptional() readonly data?: { [key: string]: string };
    @ApiPropertyOptional() readonly notification?: messaging.Notification;
    @ApiPropertyOptional() readonly android?: messaging.AndroidConfig;
    @ApiPropertyOptional() readonly webpush?: messaging.WebpushConfig;
    @ApiPropertyOptional() readonly apns?: messaging.ApnsConfig;
}