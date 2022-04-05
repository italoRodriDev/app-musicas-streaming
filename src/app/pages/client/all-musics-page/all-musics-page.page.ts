import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NavController, Platform } from '@ionic/angular';
import { AlertsService } from 'src/app/services/notifications/alerts.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { ConfigInitService } from '../../../services/config-app/config-init.service';
import { GetFirebaseService } from './../../../services/firebase/get-firebase.service';

@Component({
  selector: 'app-all-musics-page',
  templateUrl: './all-musics-page.page.html',
  styleUrls: ['./all-musics-page.page.scss'],
})
export class AllMusicsPagePage implements OnInit {

  db = this.fireDatabase.database;
  listGender: Array<any> = this.configInitService.listGender;
  gender: string = this.getFirebaseService.genderCategory;
  segmentViewList: number = 1;
  listAllArtist: Array<any> = [];
  listAllAlbums: Array<any> = [];
  listAllMusic: Array<any> = [];
  listAllMusicFilter: Array<any> = [];
 
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private alertService: AlertsService,
    private configInitService: ConfigInitService,
    private getFirebaseService: GetFirebaseService,
    private fireDatabase: AngularFireDatabase,
    private playerService: PlayerService
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

  // -> Recuperando genero selecionado
  getGenderSelect(ev) {

    this.gender = ev.detail.value;
    this.getAllArtists();

  }

  // -> Recuperando artistas
  getAllArtists() {

    this.db.ref('StreamingMusic/Artist')
      .orderByChild('gender')
      .equalTo(this.gender)
      .limitToFirst(20)
      .on('value', snapshot => {

        const data = snapshot.val();
        if (data) {

          while(this.listAllMusicFilter.length){
            this.listAllMusicFilter.pop();
          }

          let list = Object.keys(data).map(index => data[index]);
          this.getAllAlbumArtist(list);
        }else{

          this.alertService.showAlert('Ops! Ainda não temos músicas com esse gênero.','Tente outro gênero.');
        }

      });


  }

  // -> Recuperando albums dos artistas
  getAllAlbumArtist(listArtist) {

    for (let ARTIST of listArtist) {

      this.db.ref('StreamingMusic/Album')
        .child(ARTIST.id)
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) {

            let list = Object.keys(data).map(index => data[index]);
            this.getAllMusicAlbumArtist(list);

          }

        });

    }


  }

  // -> Recuperando musicas dos albums
  getAllMusicAlbumArtist(listAlbums) {

    let list: Array<any> = [];

    for (let ALBUM of listAlbums) {
  
      this.db.ref('StreamingMusic/MusicAlbum')
        .child(ALBUM.id)
        .on('value', snapshot => {

          const data = snapshot.val();
          if (data) {

            list = Object.keys(data).map(index => data[index]);
            
            for(let MUSIC of list){

              this.listAllMusic.push(MUSIC);
              
            }
            this.listAllMusicFilter = this.listAllMusic;
          }

        });
        
    }
   

  }

  // -> Click item lista de musicas
  onClickplay(dataMusic) {

    this.playerService.listReprodution = this.listAllMusic;
    this.playerService.start(dataMusic);

  }

  // -> Segmento do tipo de visu. da lista
  getSegmentList(ev){

    this.segmentViewList = ev.detail.value;

  }

  // -> Buscando com seachbar
  filterSearchbar(ev) {

    let value = ev.detail.value;

    if (value.length >= 4 && value !== '') {

      this.listAllMusicFilter = this.listAllMusic
      .filter(data => data.title.toLowerCase().indexOf(value.toLowerCase().trim()) > -1 
      );

    } else {

      this.listAllMusicFilter = this.listAllMusic;
    }

  }

}
