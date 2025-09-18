import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-toggle-translate',
  templateUrl: './toggle-translate.component.html',
  styleUrls: ['./toggle-translate.component.scss']
})
export class ToggleTranslateComponent {
  currentLang: string = 'es';

  constructor(
    private translate: TranslateService,
    private toastCtrl: ToastController
  ) {
    this.translate.setDefaultLang(this.currentLang);
  }

  get isSpanish(): boolean {
    return this.currentLang === 'es';
  }

  async toggleLang() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);

    const msg = this.translate.instant('LOGIN.LANG_CHANGED');
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }
}
