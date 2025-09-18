import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { updateProfile } from 'firebase/auth';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    const { name, lastname, email, password } = this.registerForm.value;

    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario…'
    });
    await loading.present();

    try {
      const cred = await this.auth.register(email, password);
    if (cred.user) {
    await cred.user.updateProfile({
    displayName: `${name} ${lastname}`
      });
        }

      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Registro exitoso. Verifica tu correo.',
        color: 'success',
        duration: 2000
      });
      await toast.present();
      this.router.navigateByUrl('/login');
    } catch (err: any) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: err.message || 'Error al registrar',
        color: 'danger',
        duration: 3000
      });
      await toast.present();
      console.error('Registro fallido:', err);
    }
  }
}