import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot) {
    let owner = localStorage.getItem('owner');
    console.log("owner:", owner)
    if (owner == 'true') {
      return true;
    }
    this.router.navigate(['/search']);
    return false;
  }
}
