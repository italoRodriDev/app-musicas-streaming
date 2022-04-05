import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AnimationController, AnimationDirection, IonImg, NavController } from '@ionic/angular';
import { ConfigInitService } from '../../../services/config-app/config-init.service';
import { GetFirebaseService } from './../../../services/firebase/get-firebase.service';

@Component({
  selector: 'app-tab-home',
  templateUrl: './tab-home.page.html',
  styleUrls: ['./tab-home.page.scss'],
})
export class TabHomePage implements OnInit {

  @ViewChild('header') header: ElementRef;
  @ViewChild(IonImg) ionImg: IonImg;

  messageDay: string = 'Aguarde um momento...';
  slidesOpts = { initialSlide: 0, speed: 300, spaceBetween: 1, slidesPerView: 3, freeMode: true };
  lastScrollTop: number = 0;
  animation: any;

  toggleArtist: boolean = true;
  togglePlayList: boolean = true;
  toggleBestArtist: boolean = true;
  toggleBestPlayList: boolean = true;

  listGender: Array<any> = this.configInitService.listGender;
  listBestArtist: Array<any> = [];
  listBestPlayList: Array<any> = [];
  listArtist: Array<any> = [];
  listPlayList: Array<any> = [];
  listCategory: Array<any> = [1, 2, 3];

  constructor(
    private renderer: Renderer2,
    private animationCtrl: AnimationController,
    private configInitService: ConfigInitService,
    private navCtrl: NavController,
    private fireAuth: AngularFireAuth,
    private getFirebaseService: GetFirebaseService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.createAnimations();
    this.getDataService();
  }

  // -> Recuperando dados do servico
  getDataService() {

    setTimeout(() => {

      // -> Recuperando mensagem de hora do dia
      this.messageDay = this.getFirebaseService.messageTimeDay;

      // -> Recuperando lista de artistas
      this.listArtist = this.getFirebaseService.listArtist;
      if (this.listArtist.length > 0) {

        while (this.listCategory.length > 0) this.listCategory.pop();
        this.listCategory.push({ title: 'Gêneros Musicais', list: this.listGender, type: 'gender' }, { title: 'Artistas', list: this.listArtist, type: null });
        this.toggleArtist = false;
      }

      // -> Recuperando lista de melhores artistas
      this.listBestArtist = this.getFirebaseService.listBestsArtist;
      if (this.listBestArtist.length > 0) {

        this.listCategory.push({ title: 'Artistas Populares', list: this.listBestArtist, type: null });
        this.toggleBestArtist = false;
      }

      // -> Recuperando lista de playlists
      this.listPlayList = this.getFirebaseService.listPlayList;
      if (this.listPlayList.length > 0) {

        this.listCategory.push({ title: 'PlayLists', list: this.listPlayList, type: null });
        this.togglePlayList = false;
      }

      // -> Recuperando lista de melhores playlists
      this.listBestPlayList = this.getFirebaseService.listBestsPlayList;
      if (this.listBestPlayList.length > 0) {

        this.listCategory.push({ title: 'PlayLists Populares', list: this.listBestPlayList, type: null });
        this.toggleBestPlayList = false;
      }

    }, 3000);

  }

  // -> Click nos generos
  onClickgenderMusic(type, data) {

    if (type == 'MUSICA') {

      this.getFirebaseService.genderCategory = data.title;
      this.navCtrl.navigateForward('all-musics-page');

    } else if (type == 'ARTISTA') {

      this.navCtrl.navigateForward('all-artists-page');
    }

  }

  // -> Click nos tabs
  onClickTabs(type) {

    switch (type) {
      case 'BUSCAR':
        this.navCtrl.navigateForward('search-page');
        break;
      case 'MINHA_LISTA':
        this.navCtrl.navigateForward(['profile-page', 'minha-lista']);
        break;
      case 'PERFIL':
        this.navCtrl.navigateForward(['profile-page', 'meu-perfil']);
        break;
    }

  }

  // -> Criando animações
  createAnimations() {

    this.animation = this.animationCtrl.create()
      .addElement(this.header.nativeElement)
      .duration(300)
      .direction('reverse')
      .fromTo('transform', 'translaterY(0)', `translateY(-${this.header.nativeElement.clientHeight}px)`);

  }

  // -> Evento de rolagem
  onScrollEvent(ev) {

    const scrollTop = ev.detail.scrollTop;
    const header = this.header.nativeElement;

    const direction: AnimationDirection =
      scrollTop > this.lastScrollTop ? 'normal' : 'reverse';

    scrollTop > 50
      ? this.renderer.addClass(header, 'toolbar-anim')
      : this.renderer.removeClass(header, 'toolbar-anim');

    if (this.animation.getDirection() != direction) {
      this.animation.direction(direction).play();
      this.lastScrollTop = scrollTop;
    }
  }

  // -> Click no menu header
  onClickToolbar(type) {

    switch (type) {
      case 'MUSICAS':
        this.navCtrl.navigateForward('all-musics-page');
        break;
      case 'ARTISTAS':
        this.navCtrl.navigateForward(['all-artists-page', 'artistas']);
        break;
    }

  }

  // -> Click no item da lista
  onClickItemList(item) {

    if (item.path) {

      if (item.best == true) {
        this.navCtrl.navigateForward([item.path, 'best']);
      } else {
        this.navCtrl.navigateForward([item.path, '']);
      }

    } else {

      switch (item.type) {
        case 'Artista':

          this.getFirebaseService.dataDetail = item;
          this.getFirebaseService.getAlbumsArtist(item);

          break;
        case 'Playlist':

          this.getFirebaseService.dataDetail = item;
          this.getFirebaseService.getMusicsPlaylist(item);

          break;
      }

      this.navCtrl.navigateForward(['playlist-music-page', item.id]);

    }

  }

  // -> Btn sair da conta
  signOutAccount() {

    this.fireAuth.signOut().then(() => {

      this.navCtrl.navigateBack('splash');

    });

  }


}
