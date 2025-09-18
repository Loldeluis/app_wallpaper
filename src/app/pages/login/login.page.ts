import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth';
import { ToastController } from '@ionic/angular';

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
    private toastCtrl: ToastController
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
