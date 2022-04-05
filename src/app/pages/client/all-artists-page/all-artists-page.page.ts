import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { AlertsService } from 'src/app/services/notifications/alerts.service';
import { ConfigInitService } from '../../../services/config-app/config-init.service';

@Component({
  selector: 'app-all-artists-page',
  templateUrl: './all-artists-page.page.html',
  styleUrls: ['./all-artists-page.page.scss'],
})
export class AllArtistsPagePage implements OnInit {

  db = this.fireDatabase.database;
  listGender: Array<any> = this.configInitService.listGender;
  segmentViewList: number = 1;
  listAllArtist: Array<any> = [];
  listAllArtistFilter: Array<any> = [];
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
    this.getAllArtists();
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

        this.listAllArtistFilter.filter(data => data.best == true);
      }

    });

  }

  // -> Recuperando genero selecionado
  getGenderSelect(ev) {

    this.gender = ev.detail.value;
    this.getAllArtists();

  }

  // -> Recuperando artistas
  getAllArtists() {

    return new Promise<any>(resolve => {

      this.db.ref('StreamingMusic/Artist')
        .orderByChild('gender')
        .equalTo(this.gender)
        .limitToFirst(20)
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) {
            resolve(data);
          } else {
            this.alertService.showAlert('Ops! Nenhum artista com esse gênero foi encotrado.', 'Tente outro gênero!');
          }

        });

    }).then(data => {

      this.listAllArtist = Object.keys(data).map(index => data[index]);
      this.listAllArtistFilter = this.listAllArtist;
      this.configInit();
    });

  }

  // -> Buscando com seachbar
  filterSearchbar(ev) {

    let value = ev.detail.value;

    if (value && value !== '') {

      if (value.length > 8) {

        return new Promise<any>(resolve => {

          this.db.ref('StreamingMusic/Artist')
            .orderByChild('titleSearch')
            .startAt(value.toLowerCase())
            .limitToFirst(8)
            .once('value', snapshot => {

              const data = snapshot.val();
              if (data) {
                resolve(data);
              } else {

                this.listAllArtistFilter = this.listAllArtist;
              }

            });

        }).then(data => {

          this.listAllArtistFilter = Object.keys(data).map(index => data[index]);

        });

      }

    }else{

      this.listAllArtistFilter = this.listAllArtist;
    }

  }

  // -> Click no item da lista
  onClickItemList(item){

    this.getFirebaseService.dataDetail = item;
    this.getFirebaseService.getAlbumsArtist(item);
    this.navCtrl.navigateForward(['playlist-music-page',item.id]);
  }
  
  // -> Segmento do tipo de visu. da lista
  getSegmentList(ev){

    this.segmentViewList = ev.detail.value;

  }

}
