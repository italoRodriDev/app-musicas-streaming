import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) { }

  // -> Loading Controller
  async showLoading(message) {

    const loading = await this.loadingCtrl.create({
      message: message,
    });
    return loading;

  }

  // -> Toast Controller
  async showToast(message) {

    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();

  }

  // -> Alert Controller
  async showAlert(header, message) {

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { }
        },
        {
          text: 'Continuar',
          handler: () => { }
        }
      ]
    });
    alert.present();

  }

  // -> Tocar Audio Alerta
  playSound() {

    const sound = new Audio('assets/notification.mp3');
    sound.loop = true;
    sound.playbackRate = 1;
    setTimeout(() => {
      sound.pause();
    }, 3000);
    return sound;
  }
}
