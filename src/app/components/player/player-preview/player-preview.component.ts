import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CreatePlaylistPagePage } from 'src/app/pages/client/create-playlist-page/create-playlist-page.page';
import { GetFirebaseService } from 'src/app/services/firebase/get-firebase.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { LetterPagePage } from './../../../pages/client/letter-page/letter-page.page';
import { AlertsService } from './../../../services/notifications/alerts.service';


@Component({
  selector: 'app-player-preview',
  templateUrl: './player-preview.component.html',
  styleUrls: ['./player-preview.component.scss'],
})
export class PlayerPreviewComponent implements OnInit {

  @ViewChild('range', { static: false }) rangeProgress;

  backgroundColor: string;
  dataDetail: any;
  activeTrack: any;
  isPlaying: boolean = false;
  onLoadTrack: boolean = false;
  progress: number = 0;
  timeSeek: number = 0;
  toggleView: boolean = false;
  toggleRepeat: boolean = false;
  timeTrack: any = '00:00';
  library: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private playerService: PlayerService,
    private getFirebaseService: GetFirebaseService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.playerService.dataDetail.subscribe(dataDetail =>
      this.dataDetail = dataDetail
    )
    this.playerService.activeTrack.subscribe(trak =>
      this.activeTrack = trak
    );
    this.playerService.repeatCtrl.subscribe(repeat => {
      this.toggleRepeat = repeat;
    });
    this.playerService.onLoad.subscribe(load =>
      this.onLoadTrack = load
    );
    this.playerService.isPlaying.subscribe(result =>
      this.isPlaying = result
    );
    this.playerService.timeSeek.subscribe(time =>
      this.controlDurationMusic(time)
    );
    this.playerService.progress.subscribe(progress => {
      this.progress = progress
    });

    this.configInit();
    this.generateBackground();
  }

  // -> ConfigInit
  configInit() {

    this.route.params.subscribe(route => {

      if (route.id == 'biblioteca') {

        this.library = true;
      } else {
        this.library = false;
      }

    });

  }

  // -> Iniciar musica
  start(music) {

    this.playerService.start(music);

  }

  // -> Musica anterior
  prev() {

    if (window.navigator.onLine) this.playerService.prev();
  }

  // -> Proxima musica
  next() {

    if (window.navigator.onLine) this.playerService.next();
  }

  // -> Convertendo os segundos da musica em minutos
  controlDurationMusic(timeTrack) {

    var hours = Math.floor(timeTrack / (60 * 60));
    var rest = timeTrack % (60 * 60);
    var minutes = Math.floor(timeTrack / 60);
    rest %= 60;
    var seconds = Math.ceil(rest);

    let minFormat: string = minutes < 10 ? "0" + minutes : minutes.toString();
    let secFormat: string = seconds < 10 ? "0" + seconds : seconds.toString();
    let houFormat: string = hours < 10 ? "0" + hours : hours.toString();

    this.timeTrack = `${minFormat}:${secFormat}`

  }

  // -> Toggle play/pause
  togglePlayer(dataToggle) {

    this.playerService.togglePlayer(dataToggle);

  }

  // -> Toggle de repeticao de musica
  toggleRepeatMusic() {

    this.toggleRepeat == false
      ? this.toggleRepeat = true
      : this.toggleRepeat = false;

    this.playerService.repeatCtrl.emit(this.toggleRepeat);
  }

  // -> Mostrando modal criar playlist
  async showModalAddMusic(ev) {

    const modal = await this.modalCtrl.create({
      component: CreatePlaylistPagePage,
      componentProps: {
        track: this.activeTrack,
        dataDetail: this.dataDetail,
      },
    });
    modal.present();

  }

  // -> Controlador toggle de visualizacao
  toggleViewCtrl() {

    setTimeout(() => {

      this.toggleView == false
        ? this.toggleView = true
        : this.toggleView = false;

    }, 300);

  }

  // -> Seek Progresso da musica
  updateSeek() {

    let range = this.rangeProgress.nativeElement.value;

    if(range <= 100){
      this.playerService.newValueSeek.emit(range);
      this.playerService.seek();
    }
    
  }

  // -> Gerando cor de background
  generateBackground() {

    setInterval(() => {

      this.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    }, 3000);

  }

  // -> Click Ver artista
  onViewArtist() {



  }

  // -> Mostrar letra da musica
  async showModalLetter() {

    const modal = await this.modalCtrl.create({
      component: LetterPagePage,
      componentProps: {
        track: this.activeTrack,
        dataDetail: this.dataDetail,
      },
    });
    modal.present();
  }

}