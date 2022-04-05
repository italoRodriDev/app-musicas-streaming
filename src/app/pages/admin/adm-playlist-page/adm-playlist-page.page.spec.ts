import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdmPlaylistPagePage } from './adm-playlist-page.page';

describe('AdmPlaylistPagePage', () => {
  let component: AdmPlaylistPagePage;
  let fixture: ComponentFixture<AdmPlaylistPagePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmPlaylistPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdmPlaylistPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
