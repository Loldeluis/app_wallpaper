import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/services/supabase.service';
@Component({
  standalone: false,
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent{
  images: string[] = [];
  constructor(private supabaseService: SupabaseService) {}

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await this.supabaseService.uploadWallpaper(file);

      if (url) {
        this.images.push(url);
      }
    }
  }

}
