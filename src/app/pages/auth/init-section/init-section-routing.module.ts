import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitSectionPage } from './init-section.page';

const routes: Routes = [
  {
    path: '',
    component: InitSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitSectionPageRoutingModule {}
