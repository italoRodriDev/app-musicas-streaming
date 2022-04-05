import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { AlertsService } from './../../../services/notifications/alerts.service';

@Component({
  selector: 'app-playlist-user-page',
  templateUrl: './playlist-user-page.page.html',
  styleUrls: ['./playlist-user-page.page.scss'],
})
export class PlaylistUserPagePage implements OnInit {

  idUser = sessionStorage.getItem('user');
  db = this.fireDatabase.database;
  dataDetail: any = this.getFirebaseService.dataDetail;
  listMusics: Array<any> = [];
  listMusicsFilter: Array<any> = [];

  constructor(
    private fireDatabase: AngularFireDatabase,
    private getFirebaseService: GetFirebaseService,
    private playerService: PlayerService,
    private alertsService: AlertsService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getDataService();
  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

      this.listMusics = this.getFirebaseService.listMusicUser;
      this.listMusicsFilter = this.listMusics;

    }, 3000);

  }

  // -> Click item lista de musicas
  onClickplay(dataMusic) {

    this.playerService.listReprodution = this.listMusics;
    this.playerService.start(dataMusic);

  }

  // -> Filtrando musicas seatchbar
  filterSearchbar(ev) {

    let value = ev.detail.value;

    if (value && value !== '') {

      this.listMusicsFilter = this.listMusics
        .filter(data => data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1
        );

    } else {

      this.listMusicsFilter = this.listMusics;
    }

  }

  // -> Remover musica da playlist
  async removeMusic(item){

   const alert = await this.alertCtrl.create({
      header: 'Deseja Remover da sua playlist?',
      subHeader: 'Música: ' + item.title,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {}
        },
        {
          text: 'Confirmar',
          handler: () => {

            this.db.ref('StreamingMusic/MusicsUser')
            .child(this.idUser)
            .child(this.dataDetail.id)
            .child(item.id)
            .remove()
            .then(() => {
        
              this.alertsService.showAlert('A Música logo logo será removida da sua playlist','Pode continuar escutando suas músicas.');
        
            });

          }
        }
      ]
    });
    alert.present();
    
  }

}
