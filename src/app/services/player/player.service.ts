import { EventEmitter, Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  dataDetail = new EventEmitter();
  activeTrack = new EventEmitter();
  isPlaying = new EventEmitter<boolean>();
  onLoad = new EventEmitter<boolean>();
  progress = new EventEmitter<number>();
  newValueSeek = new EventEmitter<number>();
  durationSeek = new EventEmitter<number>();
  timeSeek = new EventEmitter<number>();
  repeatCtrl = new EventEmitter<boolean>();
  currentMusic: any;
  repeat: boolean = null;
  player: Howl = null;
  listReprodution: Array<any> = [];

  constructor() { }

  ngOnInit() {



  }

  // -> Iniciar musica
  start(music) {

    this.currentMusic = music;
  
    this.repeatCtrl.subscribe(response => {
      this.repeat = response
      console.log(response);
    });

    if (this.player != null) {
      this.player.stop();
      this.player = null;
    }

    this.player = new Howl({
      src: [this.currentMusic.url],
      html5: true,
      loop: this.repeat,
      onload: () => {

        this.onLoad.emit(true);

      },
      onplay: () => {

        this.onLoad.emit(false);
        this.isPlaying.emit(true);
        this.activeTrack.emit(this.currentMusic);
        this.updateProgress();

      },
      onend: () => {

        if (this.player.loop() == false) {

          let index = this.listReprodution.indexOf(this.currentMusic);
          if (index != this.listReprodution.length - 1) {
            this.start(this.listReprodution[index + 1]);
          } else {

            this.start(this.listReprodution[0]);
          }
        }

      }
    });
    this.player.play();

    return this.isPlaying;

  }

  // -> Toggle play/pause
  togglePlayer(pause) {
    this.isPlaying.emit(!pause);
    if (pause == true) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  // -> Musica anterior
  prev() {

    let index = this.listReprodution.indexOf(this.currentMusic);
    if (index > 0) {
      this.start(this.listReprodution[index - 1]);

    } else {
      this.start(this.listReprodution[this.listReprodution.length - 1]);
    }

  }

  // -> Proxima musica
  next() {

    let index = this.listReprodution.indexOf(this.currentMusic);
    if (index != this.listReprodution.length - 1) {
      this.start(this.listReprodution[index + 1]);
    } else {

      this.start(this.listReprodution[0]);
    }


  }

  // -> Seek Progresso da musica
  seek() {

    this.durationSeek.emit(this.player.duration());

    this.durationSeek.subscribe(duration => {
      this.newValueSeek.subscribe(newValue => {

        this.player.seek(duration * newValue / 100);
      });
    });

  }

  // -> Atualizando range progresso
  updateProgress() {

    let seek = this.player.seek();
    let duration = this.player.duration();

    this.timeSeek.emit(seek);
    this.progress.emit((seek / duration) * 100 || 0);

    setTimeout(() => {

      this.updateProgress();

    }, 100);

  }

}