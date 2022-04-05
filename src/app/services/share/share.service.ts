import { AlertsService } from './../notifications/alerts.service';
import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(
    private alertsService: AlertsService,

  ) { }

  // -> Compartilhar
  async shareSocial(title) {

    if (navigator.share) {

      navigator.share({
        title: 'Achei muito top! Está disponível no Task Music...',
        text: title,
        url: 'http://task-play-streaming.web.app',
      }).catch(() => {

        this.alertsService.showToast('Ops! Não é possivel compartilhar no momento...');
      });

    } else {

    }
    await Share.share({
      title: 'Achei muito top! Está disponível no Task Music...',
      text: title,
      url: 'http://task-play-streaming.web.app',
      dialogTitle: 'Task Music',
    }).catch(() => {

      this.alertsService.showToast('Ops! Não é possivel compartilhar no momento...');
    });

  }

}
