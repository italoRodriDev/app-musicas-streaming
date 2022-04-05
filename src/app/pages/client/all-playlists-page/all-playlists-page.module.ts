import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllPlaylistsPagePageRoutingModule } from './all-playlists-page-routing.module';

import { AllPlaylistsPagePage } from './all-playlists-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllPlaylistsPagePageRoutingModule,
    SharedComponentsModule,
    LazyLoadImageModule
  ],
  declarations: [AllPlaylistsPagePage]
})
export class AllPlaylistsPagePageModule {}
