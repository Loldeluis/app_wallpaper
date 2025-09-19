import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // Observable del usuario actual
  user$ = this.authService.currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  logout() {
    this.authService.logout()
      .then(() => this.router.navigateByUrl('/login', { replaceUrl: true }));
  }
}