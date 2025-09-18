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

async onToggle(event: any) {
  const checked = event.detail.checked;
  const newLang = checked ? 'en' : 'es';

  this.translate.use(newLang);

  const msg = this.translate.instant('SYSTEM.LANG_CHANGED');
  const toast = await this.toastCtrl.create({
    message: msg,
    duration: 2000,
    position: 'top',
    color: 'primary'
  });
  await toast.present();
}
}
