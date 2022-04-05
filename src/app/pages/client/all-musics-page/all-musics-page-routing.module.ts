import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllMusicsPagePage } from './all-musics-page.page';

const routes: Routes = [
  {
    path: '',
    component: AllMusicsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllMusicsPagePageRoutingModule {}
