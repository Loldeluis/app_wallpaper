import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController, ActionSheetController } from '@ionic/angular'; // 👈 importa aquí
import { Capacitor } from '@capacitor/core';

// IMPORTA solo UNA vez el wrapper TS del plugin (ajusta la ruta)
import MyCustom from 'src/app/plugins/MyCustomPlugin';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$: Observable<any>;
  wallpapers: any[] = [];
  uploading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private supabaseService: SupabaseService,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController // 👈 inyecta aquí
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    this.user$.subscribe(async user => {
      if (user) {
        this.wallpapers = await this.authService.getMyWallpapers();
        console.log('🖼 Wallpapers cargados:', this.wallpapers);
      } else {
        this.wallpapers = [];
      }
    });
  }

  /** Mostrar opciones cuando selecciono una imagen */
  async selectWallpaper(url: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Usar como',
      buttons: [
        {
          text: 'Fondo de inicio',
          handler: () => this.setAsWallpaper(url, 'home')
        },
        {
          text: 'Pantalla de bloqueo',
          handler: () => this.setAsWallpaper(url, 'lock')
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  /** Llamada al plugin - verifica plataforma antes */
  async setAsWallpaper(url: string, type: 'home' | 'lock' = 'home') {
    if (Capacitor.getPlatform() === 'web') {
      const toast = await this.toastCtrl.create({
        message: 'Plugin nativo no disponible en web. Prueba en dispositivo Android.',
        duration: 2500,
        position: 'bottom'
      });
      await toast.present();
      console.warn('Intentaste usar plugin en web. URL:', url);
      return;
    }

    try {
      const loading = await this.toastCtrl.create({ message: 'Aplicando fondo...', duration: 2000 });
      loading.present();

      const res = await MyCustom.setWallpaper({ url, type });
      console.log('Plugin result:', res);

      const toast = await this.toastCtrl.create({
        message: res?.message || 'Fondo aplicado',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
    } catch (err: any) {
      console.error('Error plugin:', err);
      const toast = await this.toastCtrl.create({
        message: 'Error al aplicar fondo: ' + (err?.message || err),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    }
  }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigateByUrl('/login', { replaceUrl: true }))
      .catch(err => console.error('Logout error:', err));
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  // Subir imagen con Camera (igual que antes)
  async onUploadImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
      });

      if (image && image.base64String) {
        const byteCharacters = atob(image.base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], `wallpaper-${Date.now()}.jpg`, { type: 'image/jpeg' });

        this.uploading = true;
        await this.supabaseService.uploadWallpaper(file);
        this.wallpapers = await this.authService.getMyWallpapers();
        this.uploading = false;
      }
    } catch (err) {
      console.error('❌ Error al capturar o subir imagen:', err);
    }
  }
}
