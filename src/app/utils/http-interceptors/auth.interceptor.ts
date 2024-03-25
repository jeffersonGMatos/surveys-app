import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { AppService } from "../../app.service";
import { environment } from "../config";

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const appService = inject<AppService>(AppService);
  const exp = new RegExp(`${environment.api_host}/public/`);
  let headers = req.headers;

  if (exp.test(req.url) === false && appService.authJwt)
    headers = headers.append('Authorization', `jwt ${appService.authJwt}`);

  return next(req.clone({ headers }));
}