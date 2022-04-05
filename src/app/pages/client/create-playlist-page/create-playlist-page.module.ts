import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePlaylistPagePageRoutingModule } from './create-playlist-page-routing.module';

import { CreatePlaylistPagePage } from './create-playlist-page.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePlaylistPagePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ],
  declarations: [CreatePlaylistPagePage]
})
export class CreatePlaylistPagePageModule {}
