// src/app/pages/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';// ajusta ruta si es necesario
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular'; // <- import
import myCustom from 'src/app/plugins/MyCustomPlugin'; // ajusta ruta si es necesario

// Importa el plugin personalizado
import MyCustom from 'src/app/plugins/MyCustomPlugin';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$: Observable<any>; // observable del usuario autenticado
  wallpapers: any[] = [];
  uploading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private supabaseService: SupabaseService,
    private toastCtrl: ToastController
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
        // Apenas entra al Home, cargamos wallpapers del usuario
    this.user$.subscribe(async user => {
      if (user) {
        this.wallpapers = await this.authService.getMyWallpapers();
        console.log('🖼 Wallpapers cargados:', this.wallpapers);
      } else {
        this.wallpapers = [];
      }
    });
  }

async setAsWallpaper(url: string, type: 'home' | 'lock' = 'home') {
  try {
    const toastLoading = await this.toastCtrl.create({ message: 'Aplicando fondo...', duration: 2000 });
    toastLoading.present();

    const res = await MyCustom.setWallpaper({ url, type });
    console.log('Plugin result:', res);

    const toast = await this.toastCtrl.create({
      message: res?.message || 'Hecho',
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  } catch (err: any) {
    console.error('Error plugin:', err);
    const toast = await this.toastCtrl.create({
      message: 'Error al aplicar fondo: ' + (err?.message || err),
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }
}


  // logout ya lo tenías; usa el método modular
  logout() {
    this.authService.logout()
      .then(() => this.router.navigateByUrl('/login', { replaceUrl: true }))
      .catch(err => console.error('Logout error:', err));
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

 // 📸 Subir imagen desde galería o cámara
  async onUploadImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Base64, // obtenemos base64
        source: CameraSource.Prompt, // prompt: permite elegir cámara o galería
      });

      if (image && image.base64String) {
        // Convertir base64 a File
        const byteCharacters = atob(image.base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], `wallpaper-${Date.now()}.jpg`, { type: 'image/jpeg' });

        this.uploading = true;
        await this.supabaseService.uploadWallpaper(file);
        // 🔄 refrescar lista
        this.wallpapers = await this.authService.getMyWallpapers();
        this.uploading = false;
      }
    } catch (err) {
      console.error('❌ Error al capturar o subir imagen:', err);
    }
  }


}
