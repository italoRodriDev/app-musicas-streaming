import { PlayerService } from 'src/app/services/player/player.service';
import { PlayerPreviewComponent } from 'src/app/components/player/player-preview/player-preview.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-item-music',
  templateUrl: './card-item-music.component.html',
  styleUrls: ['./card-item-music.component.scss'],
  providers: [PlayerService]
})
export class CardItemMusicComponent implements OnInit {

  @Input() dataMusic: any;
  @Input() index: number;
  @Input() listMusic: Array<any> = [];

  constructor(
    public playerPrevComp: PlayerPreviewComponent,
    private playerService: PlayerService
  ) { }

  ngOnInit() {}

}
