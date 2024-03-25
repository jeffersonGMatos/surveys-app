import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, map } from "rxjs";
import { AppService } from "../../app.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  let appService = inject<AppService>(AppService)
  let router = inject<Router>(Router)

  return appService.auth().pipe(
    map(value => {
      if (!value)
        router.navigate(['login'], {
          queryParams: {
            redirect: state.url
          }
        })

      return value ? true : false
    })
  )
}