// src/app/pages/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth';// ajusta ruta si es necesario
import { SupabaseService } from 'src/app/core/services/supabase.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user$: Observable<any>; // observable del usuario autenticado
  images: string[] = [];
  uploading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private supabaseService: SupabaseService,
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {}

  // logout ya lo tenías; usa el método modular
  logout() {
    this.authService.logout()
      .then(() => this.router.navigateByUrl('/login', { replaceUrl: true }))
      .catch(err => console.error('Logout error:', err));
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

   async onUploadImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;

  input.onchange = async (ev: any) => {
    const files: FileList = ev.target.files;
    if (!files || files.length === 0) return;

    this.uploading = true;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await this.supabaseService.uploadWallpaper(file);
      if (url) this.images.unshift(url); // mostrar al inicio
    }
    this.uploading = false;
  };

  input.click();
}


}
