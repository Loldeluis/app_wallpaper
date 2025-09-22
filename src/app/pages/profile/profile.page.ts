import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController
    
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  async updateProfile() {
    const { displayName, password } = this.profileForm.value;

    try {
      if (displayName) {
        await this.authService.updateDisplayName(displayName);
        this.showToast('Nombre actualizado con éxito');
      }

      if (password) {
        await this.authService.updateUserPassword(password);
        this.showToast('Contraseña actualizada con éxito');
      }

      this.profileForm.reset();
    } catch (err: any) {
      this.showToast('Error: ' + err.message);
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'primary'
    });
    await toast.present();
  }
}
