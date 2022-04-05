import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetterPagePage } from './letter-page.page';

const routes: Routes = [
  {
    path: '',
    component: LetterPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetterPagePageRoutingModule {}
