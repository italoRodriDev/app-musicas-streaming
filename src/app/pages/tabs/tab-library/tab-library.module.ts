import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabLibraryPageRoutingModule } from './tab-library-routing.module';

import { TabLibraryPage } from './tab-library.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabLibraryPageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    LazyLoadImageModule
  ],
  declarations: [TabLibraryPage]
})
export class TabLibraryPageModule {}
