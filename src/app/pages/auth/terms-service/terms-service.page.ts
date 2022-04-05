import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.page.html',
  styleUrls: ['./terms-service.page.scss'],
})
export class TermsServicePage implements OnInit {

  disabledButton = true;
  currentRouter: string = this.route.url;
  dataStore: any = null;

  constructor(
    private modalCtrl: ModalController,
    private route: Router
  ) { }

  ngOnInit() {
    this.validateVisibleButton();
  }

  ngOnDestroy() {
    
  }

  // -> Validando visibilidade do botao aceitar
  validateVisibleButton() {

    if (this.route.url === '/tabshome/tab-settings') {

      this.disabledButton = true;
    } else {
      this.disabledButton = false;
    }

  }

  // -> Voltando
  onDismiss(response) {

    this.modalCtrl.dismiss({ response });
  }

}
