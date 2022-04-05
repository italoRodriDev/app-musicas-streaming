import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild(IonTabs) tabs: IonTabs;

  public tabSelected = '';
  public progress = 42;

  constructor() {}

  public setSelectedTab(){

    this.tabSelected = this.tabs.getSelected();

  }

}
