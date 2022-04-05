import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TabProfilePageRoutingModule } from './tab-profile-routing.module';
import { TabProfilePage } from './tab-profile.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabProfilePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule {}
