import { HttpStatus } from '@nestjs/common';
import * as createError from 'http-errors';


export abstract class BaseDataService {
    throwUnProcessableEntity() {
        return Promise.reject(createError(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity'));
    }

    throwInternalServerError(err) {
        return Promise.reject(createError(HttpStatus.INTERNAL_SERVER_ERROR, err));
    }
}