import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkeletonAllArtistMusicsComponent } from './skeleton-all-artist-musics.component';

describe('SkeletonAllArtistMusicsComponent', () => {
  let component: SkeletonAllArtistMusicsComponent;
  let fixture: ComponentFixture<SkeletonAllArtistMusicsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkeletonAllArtistMusicsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonAllArtistMusicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
