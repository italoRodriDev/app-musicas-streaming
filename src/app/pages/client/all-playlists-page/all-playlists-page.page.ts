import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { ConfigInitService } from 'src/app/services/config-app/config-init.service';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';

@Component({
  selector: 'app-all-playlists-page',
  templateUrl: './all-playlists-page.page.html',
  styleUrls: ['./all-playlists-page.page.scss'],
})
export class AllPlaylistsPagePage implements OnInit {

  db = this.fireDatabase.database;
  listGender: Array<any> = this.configInitService.listGender;
  segmentViewList: number = 1;
  listAllPlayList: Array<any> = [];
  listAllPlayListFilter: Array<any> = [];
  gender: string = 'Forró';

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private alertService: AlertsService,
    private configInitService: ConfigInitService,
    private fireDatabase: AngularFireDatabase,
    private getFirebaseService: GetFirebaseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.onBackButton();
    this.getAllPlayLists();
  }

  // -> Btn voltar plataforma nativa
  onBackButton() {

    this.platform.backButton.subscribeWithPriority(10, () => {

      this.navCtrl.back();

    });

  }

  // -> Config Iniciais
  configInit(){

    this.route.params.subscribe(data => {

      const type = data['id'];

      if(type == true){

        this.listAllPlayListFilter.filter(data => data.best == true);
      }

    });

  }

  // -> Recuperando genero selecionado
  getGenderSelect(ev) {

    this.gender = ev.detail.value;
    this.getAllPlayLists();

  }

  // -> Recuperando playlists
  getAllPlayLists() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/PlayLists')
        .orderByChild('gender')
        .equalTo(this.gender)
        .limitToFirst(20)
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) {
            resolve(data);
          } else {
            this.alertService.showAlert('Ops! Nenhuma playlist com esse gênero foi encotrada.', 'Tente outro gênero!');
          }

        });

    }).then(data => {

      this.listAllPlayList = Object.keys(data).map(index => data[index]);
      this.listAllPlayListFilter = this.listAllPlayList;
      this.configInit();
    });

  }

  // -> Buscando com seachbar
  filterSearchbar(ev) {

    let value = ev.detail.value;

    if (value && value !== '') {

      if (value.length > 8) {

        return new Promise<any>(resolve => {

          this.db.ref('StreamingMusic/PlayLists')
            .orderByChild('titleSearch')
            .startAt(value.toLowerCase())
            .limitToFirst(8)
            .once('value', snapshot => {

              const data = snapshot.val();
              if (data) {
                resolve(data);
              } else {

                this.listAllPlayListFilter = this.listAllPlayList;
              }

            });

        }).then(data => {

          this.listAllPlayListFilter = Object.keys(data).map(index => data[index]);

        });

      }

    } else {

      this.listAllPlayListFilter = this.listAllPlayList;
    }

  }

  // -> Click no item da lista
  onClickItemList(item) {

    this.getFirebaseService.dataDetail = item;
    this.getFirebaseService.getAlbumsArtist(item);
    this.navCtrl.navigateForward(['playlist-music-page',item.id]);
  }

  // -> Segmento do tipo de visu. da lista
  getSegmentList(ev) {

    this.segmentViewList = ev.detail.value;

  }

}
