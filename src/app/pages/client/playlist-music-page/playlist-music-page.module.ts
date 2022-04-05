import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, PopoverController } from '@ionic/angular';
import { PlaylistMusicPagePageRoutingModule } from './playlist-music-page-routing.module';
import { PlaylistMusicPagePage } from './playlist-music-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistMusicPagePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [
    PlaylistMusicPagePage,
  ],
})
export class PlaylistMusicPagePageModule {}
