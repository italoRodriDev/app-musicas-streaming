import { SharedDirectivesModule } from './../../../directives/shared-directives.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
