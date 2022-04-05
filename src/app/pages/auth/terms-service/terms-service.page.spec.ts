import { AgmCoreModule } from '@agm/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { JoyrideModule } from 'ngx-joyride';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';
import { TermsServicePage } from './terms-service.page';


describe('TermsServicePage', () => {
  let component: TermsServicePage;
  let fixture: ComponentFixture<TermsServicePage>;

  const maskConfig: Partial<IConfig> = {
    validation: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsServicePage ],
      imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        LazyLoadImageModule,

        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireAnalyticsModule,
        AngularFirestoreModule,

        NgxMaskModule.forRoot(maskConfig),
        JoyrideModule.forRoot(),

        // -> Angular Maps
        AgmCoreModule.forRoot({
          apiKey: environment.apiKeyGoogleMaps,
          libraries: ['drawing'],
        }),
      ],
      providers: [
        FormBuilder,
        CurrencyPipe,
        DatePipe,


        UserTrackingService,
        ScreenTrackingService,
        {
          provide: RouteReuseStrategy,
          useClass: IonicRouteStrategy
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
