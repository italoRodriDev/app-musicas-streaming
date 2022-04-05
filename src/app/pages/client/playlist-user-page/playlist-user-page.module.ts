import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistUserPagePageRoutingModule } from './playlist-user-page-routing.module';

import { PlaylistUserPagePage } from './playlist-user-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistUserPagePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [PlaylistUserPagePage]
})
export class PlaylistUserPagePageModule {}
