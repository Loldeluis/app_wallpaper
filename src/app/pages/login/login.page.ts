import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router'; 

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router 
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      const toast = await this.toastCtrl.create({
        message: 'Login successful',
        duration: 2000,
        color: 'success'
      });
      toast.present();

            // ◀ redirige al home y reemplaza el historial
      this.router.navigateByUrl('/home', { replaceUrl: true });

      
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
