import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const absoluteUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const absoluteRequest = req.clone({
    url: environment.absoluteUrl + req.url,
  });
  return next(absoluteRequest);
};
