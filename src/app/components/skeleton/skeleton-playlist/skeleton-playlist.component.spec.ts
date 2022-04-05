import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkeletonPlaylistComponent } from './skeleton-playlist.component';

describe('SkeletonPlaylistComponent', () => {
  let component: SkeletonPlaylistComponent;
  let fixture: ComponentFixture<SkeletonPlaylistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonPlaylistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
