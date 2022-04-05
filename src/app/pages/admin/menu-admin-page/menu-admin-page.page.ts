import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';
import { ConfigInitService } from '../../../services/config-app/config-init.service';

@Component({
  selector: 'app-menu-admin-page',
  templateUrl: './menu-admin-page.page.html',
  styleUrls: ['./menu-admin-page.page.scss'],
})
export class MenuAdminPagePage implements OnInit {

  listBottomMenu: Array<any> = this.configInitService.listBottomMenu;
  listMenuLinks: Array<any> = this.configInitService.listMenuLinks;

  slideOptions: any = { slidesPerView: 3, freeMode: true };
  toggleCtrl: boolean = false;
  messageTimeDay: string;
  dataUser: any;
  
  constructor(
    private alertSevice: AlertsService,
    private fireAuth: AngularFireAuth,
    private navCtrl: NavController,
    private configInitService: ConfigInitService,
    private getFirebaseService: GetFirebaseService) {}

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.getDataService();
  }

  // -> Recuperar dados do Servico
  getDataService() {

    setTimeout(() => {
      
      this.dataUser = this.getFirebaseService.dataUserAdm;
      this.messageTimeDay = this.getFirebaseService.messageTimeDay;
    
    }, 3000);

  }

  // Click no bottomMenu
  onClickBottomMenu(path_router) {

    if (path_router == 'Sair') {

      this.fireAuth.signOut().then(() => {


        this.navCtrl.navigateBack('splash');
        this.alertSevice.showAlert('Deslogado com Sucesso!', '');
      });

    } else {

      this.navCtrl.navigateForward(path_router);
    }

  }

  // Click na list de links uteis
  onClickList(path_router) {

    window.open(path_router)
  }

  // -> Deslogando usuario
  signOutUser() {

    this.fireAuth.signOut().then(() => {

      sessionStorage.clear();
      this.navCtrl.navigateBack('splash');
      this.alertSevice.showAlert('Deslogado com Sucesso!', '');
    });
  }

}