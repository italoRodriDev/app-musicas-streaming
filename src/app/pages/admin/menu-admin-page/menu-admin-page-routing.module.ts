import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAdminPagePage } from './menu-admin-page.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAdminPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAdminPagePageRoutingModule {}
