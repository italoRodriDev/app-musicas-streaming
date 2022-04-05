import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAdminPagePageRoutingModule } from './menu-admin-page-routing.module';

import { MenuAdminPagePage } from './menu-admin-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAdminPagePageRoutingModule
  ],
  declarations: [MenuAdminPagePage]
})
export class MenuAdminPagePageModule {}
