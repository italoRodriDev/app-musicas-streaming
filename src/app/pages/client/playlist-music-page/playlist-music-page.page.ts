import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonRange } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { AlertsService } from './../../../services/notifications/alerts.service';
import { ShareService } from './../../../services/share/share.service';

@Component({
  selector: 'app-playlist-music-page',
  templateUrl: './playlist-music-page.page.html',
  styleUrls: ['./playlist-music-page.page.scss'],
})
export class PlaylistMusicPagePage implements OnInit {

  @ViewChild('range', { static: false }) rangeProgress: IonRange;

  idUser = sessionStorage.getItem('user');
  db = this.fireDatabase.database;
  backgroundColor: string;
  dataDetail: any = this.getFirebaseService.dataDetail;
  listAlbums: Array<any> = [];
  listMusics: Array<any> = [];
  listMusicsFilter: Array<any> = [];
  listUser: Array<any> = [];
  typeRouter: string;

  constructor(
    private alertCtrl: AlertController,
    private fireDatabase: AngularFireDatabase,
    private getFirebaseService: GetFirebaseService,
    private playerService: PlayerService,
    private alertsService: AlertsService,
    private shareService: ShareService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.generateBackgroud();
    this.configInit();
  }

  ionViewDidEnter() {
    this.getDataService();
  }

  // -> Confg iniciais
  configInit() {

    this.route.params.subscribe(router => this.typeRouter = router.id);

  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

      this.listAlbums = this.getFirebaseService.listAlbumsDetail;
      this.listMusics = this.getFirebaseService.listMusicsDetail;
      this.listUser = this.getFirebaseService.listPlaylistUser;
      this.listMusicsFilter = this.listMusics;

    }, 3000);

  }

  // -> Click na barra de menu
  onClickButtonBar(type) {

    switch (type) {
      case 'LIKE':
        // -> Add a lista
        this.showAlertAddPlaylist();
        break;
      case 'PLAY':
        // -> Tocar playlist
        if (this.listMusics.length) {
          this.playerService.listReprodution = this.listMusics;
          this.onClickplay(this.playerService.listReprodution[0]);
        }
        break;
      case 'SHARE':
        // Compartilhar
        this.shareService.shareSocial(this.dataDetail?.title);
        break;
    }

  }

  // -> Click item lista de musicas
  onClickplay(dataMusic) {

    this.playerService.listReprodution = this.listMusics;
    this.playerService.start(dataMusic);

  }

  // -> Mostrando alerta add a playlist
  async showAlertAddPlaylist() {

    const playlist = this.dataDetail;

    const alert = await this.alertCtrl.create({
      header: 'Deseja adicionar essa playlist a sua biblioteca?',
      subHeader: 'Ao confirmar a playlist ficará disponível na sua biblioteca.',
      message: this.dataDetail.title,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => { }
        },
        {
          text: 'Adicionar',
          handler: () => {

            this.db.ref('StreamingMusic/PlaylistUser')
              .child(this.idUser)
              .child('playlist')
              .child(playlist.id)
              .update(playlist)
              .then(() => {

                this.alertsService.showAlert('A Playlist adicionada com sucesso!', '');

              });

          }
        }
      ]
    });
    alert.present();

  }

  // -> Filtrando musicas por searchbar
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

  // -> Gerando cores de background
  generateBackgroud() {

    this.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  }

}
