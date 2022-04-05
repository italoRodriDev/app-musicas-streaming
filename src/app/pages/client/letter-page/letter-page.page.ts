import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-letter-page',
  templateUrl: './letter-page.page.html',
  styleUrls: ['./letter-page.page.scss'],
})
export class LetterPagePage implements OnInit {

  @Input() track;
  @Input() dataDetail;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  // -> Btn voltar
  public btnBackPage(){

    this.modalCtrl.dismiss();

  }

}
