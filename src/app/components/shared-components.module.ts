import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ShareService } from './../services/share/share.service';
import { CardItemMusicComponent } from './lists/card-item-music/card-item-music.component';
import { PlayerPreviewComponent } from './player/player-preview/player-preview.component';
import { SkeletonAllArtistMusicsComponent } from './skeleton/skeleton-all-artist-musics/skeleton-all-artist-musics.component';
import { SkeletonHomeComponent } from './skeleton/skeleton-home/skeleton-home.component';
import { SkeletonPlaylistComponent } from './skeleton/skeleton-playlist/skeleton-playlist.component';



@NgModule({
  declarations: [
    SkeletonAllArtistMusicsComponent,
    SkeletonPlaylistComponent,
    SkeletonHomeComponent,
    PlayerPreviewComponent,
    CardItemMusicComponent
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule
  ],
  exports: [
    SkeletonAllArtistMusicsComponent,
    SkeletonPlaylistComponent,
    SkeletonHomeComponent,
    PlayerPreviewComponent,
    CardItemMusicComponent
  ],
  providers: [
   
    ShareService,
    PlayerPreviewComponent
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedComponentsModule { }
