import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1), // solo necesitamos un valor
      map(user => {
        if (user) {
          // si está logueado, permite acceso
          return true;
        }
        // si no, redirige a login
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}