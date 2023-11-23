import { HttpErrorResponse } from '@angular/common/http';

export const transformToError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  } else if (error instanceof HttpErrorResponse) {
    return new Error(error.message);
  } else if (error instanceof Object) {
    return new Error(error.toString());
  } else {
    return new Error('unknown error occured');
  }
};
