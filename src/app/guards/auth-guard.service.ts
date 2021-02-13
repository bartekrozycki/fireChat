import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private userService: UserService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(state.url);
    console.log(this.userService.getUserLoggedIn());
    if (this.userService.getUserLoggedIn()) {
      if (state.url !== '/') {
        // this.router.navigate(['/']).then(e => {});
      }
      return true;
    }

    return this.router.createUrlTree(['/sign']);
  }

}
