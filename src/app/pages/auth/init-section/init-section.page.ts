import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateAccountPage } from './../create-account/create-account.page';
import { LoginPage } from './../login/login.page';
import { RecoverAccountPage } from './../recover-account/recover-account.page';

@Component({
  selector: 'app-init-section',
  templateUrl: './init-section.page.html',
  styleUrls: ['./init-section.page.scss'],
})
export class InitSectionPage implements OnInit {

  message: string = 'Fala pra mim do que mais fez falta';
  count: number = 0;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.setMessageInit();
  }

  // -> Config message init
  setMessageInit() {

    const listMessage: Array<string> = [
      'Senti falta da tua liberdade🎵',
      'Da falsa sensação de voar de verdade🎵',
      'Procurar meu cheiro por essa cidade🎵',
      'Quer morar junto igual casal de filme🎵',
      'Ouvir piadas, escutar o que eu rimo🎵',
      'Falar do Galo, "cê jura pra mim que odeia time"🎵',
      'Ser como água num universo que te exige firme, yeah.🎵'
    ];

    setInterval(() => {

      if (this.count < 4) {
        this.count += 1;
        this.message = listMessage[this.count];
      } else {
        this.message = listMessage[0];
        this.count = 0;
      }

    }, 3000);

  }

  // -> Clique em entrar
  async onCliqueLogin() {

    const modal = await this.modalCtrl.create({
      component: LoginPage,
      mode: 'ios'
    });
    await modal.present();

  }

  // -> Clique em cadastro
  async onClickRegister() {

    const modal = await this.modalCtrl.create({
      component: CreateAccountPage,
      mode: 'ios'
    });
    await modal.present();

  }

  // -> Clique em recuperar senha
  async onClickRecoverAccount() {

    const modal = await this.modalCtrl.create({
      component: RecoverAccountPage,
      mode: 'ios'
    });
    await modal.present();

  }

}
